import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { test, expect, afterEach, vi } from 'vitest';
import Visualizer from './Visualizer';

test('Visualizer shows local membership result for valid a^n b^n string', async () => {
  render(<Visualizer />);

  // default input value is 'aaaaabbbbb'
  const input = screen.getByDisplayValue('aaaaabbbbb');
  expect(input).not.toBeNull();

  // the component computes local checks on render; original string should be IN
  const original = await screen.findByText(/Original local check:\s*IN/i);
  expect(original).not.toBeNull();
});

// ensure DOM is cleaned between tests to avoid duplicate elements
// ensure DOM is cleaned and mocks are restored between tests to avoid cross-test pollution
afterEach(() => {
  vi.restoreAllMocks();
  cleanup();
});

test('Visualizer pumped i=1 produces original string and keeps membership', async () => {
  render(<Visualizer />);

  // default input is 'aaaaabbbbb'
  const yStart = screen.getByLabelText(/y start/i) as HTMLInputElement;
  const yEnd = screen.getByLabelText(/y end/i) as HTMLInputElement;
  fireEvent.change(yStart, { target: { value: '1' } });
  fireEvent.change(yEnd, { target: { value: '2' } });

  const iTimes = screen.getByLabelText(/Pump repetitions/i) as HTMLInputElement;
  // i = 1 is the identity (original) case for pumping
  fireEvent.change(iTimes, { target: { value: '1' } });

  // pumped string should equal original (i=1) — target the pumped-result box specifically
  const exact = await screen.findByText('aaaaabbbbb', { selector: '.pumped-result' });
  expect(exact).not.toBeNull();

  // pumped local check should be IN
  const pumpedCheck = await screen.findByText(/Pumped local check:\s*IN/i);
  expect(pumpedCheck).not.toBeNull();
});

test('Visualizer boundary y (spans a/b) pumping leads to NOT IN', async () => {
  render(<Visualizer />);

  // change the input to a smaller example crossing boundary
  const input = screen.getByLabelText(/Test string/i) as HTMLInputElement;
  fireEvent.change(input, { target: { value: 'aaabbb' } });

  // pick y that spans the a/b boundary: e.g., start=2,end=4 -> 'ab'
  const yStart = screen.getByLabelText(/y start/i) as HTMLInputElement;
  const yEnd = screen.getByLabelText(/y end/i) as HTMLInputElement;
  fireEvent.change(yStart, { target: { value: '2' } });
  fireEvent.change(yEnd, { target: { value: '4' } });

  const iTimes = screen.getByLabelText(/Pump repetitions/i) as HTMLInputElement;
  fireEvent.change(iTimes, { target: { value: '2' } });

  // pumped string should no longer be a^n b^n
  const pumpedCheck = await screen.findByText(/Pumped local check:\s*NOT IN/i);
  expect(pumpedCheck).not.toBeNull();
});

test('Visualizer server-check buttons call API and display server results (mocked)', async () => {
  render(<Visualizer />);

  // prepare fetch mock: first call -> IN, second call -> NOT IN
  type Resp = { ok: true; json: () => Promise<{ result: boolean }> };
  const mockResponses: Resp[] = [
    { ok: true, json: async () => ({ result: true }) },
    { ok: true, json: async () => ({ result: false }) },
  ];
  const g = globalThis as unknown as {
    fetch: (input: RequestInfo, init?: RequestInit) => Promise<Resp>;
  };
  const fetchMock = vi
    .spyOn(g, 'fetch')
    .mockImplementation(() => Promise.resolve(mockResponses.shift() as Resp));

  const origBtn = screen.getByText(/Check original/i) as HTMLButtonElement;
  const pumpBtn = screen.getByText(/Check pumped/i) as HTMLButtonElement;

  // click original server check
  fireEvent.click(origBtn);
  const serverIn = await screen.findByText(/SERVER:\s*IN/i);
  expect(serverIn).not.toBeNull();

  // click pumped server check
  fireEvent.click(pumpBtn);
  const serverNot = await screen.findByText(/SERVER:\s*NOT IN/i);
  expect(serverNot).not.toBeNull();

  fetchMock.mockRestore();
});

test('Visualizer pumped-string behavior: pumping y changes pumped string and local check', async () => {
  render(<Visualizer />);

  // Ensure input is the default 'aaaaabbbbb'
  const input = screen.getByLabelText(/Test string/i) as HTMLInputElement;
  expect(input.value).toBe('aaaaabbbbb');

  // set y start and end to pick a single 'a' at index 1..2
  const yStart = screen.getByLabelText(/y start/i) as HTMLInputElement;
  const yEnd = screen.getByLabelText(/y end/i) as HTMLInputElement;
  fireEvent.change(yStart, { target: { value: '1' } });
  fireEvent.change(yEnd, { target: { value: '2' } });

  // set i (pump repetitions) to 2
  const iTimes = screen.getByLabelText(/Pump repetitions/i) as HTMLInputElement;
  fireEvent.change(iTimes, { target: { value: '2' } });

  // The pumped-result element should update accordingly
  const pumped = await screen.findByText(/Pumped string/i);
  expect(pumped).not.toBeNull();

  // More exactly, the pumped string should now have 6 'a's and 5 'b's: 'aaaaaabbbbb'
  const exact = await screen.findByText('aaaaaabbbbb');
  expect(exact).not.toBeNull();

  // And the pumped local check should be NOT IN
  const pumpedCheck = await screen.findByText(/Pumped local check:\s*NOT IN/i);
  expect(pumpedCheck).not.toBeNull();
});

test('Visualizer validation prevents server checks and shows message when y empty or xy too long', async () => {
  render(<Visualizer />);

  // pick an empty y by setting start==end
  const yStart = screen.getByLabelText(/y start/i) as HTMLInputElement;
  const yEnd = screen.getByLabelText(/y end/i) as HTMLInputElement;
  fireEvent.change(yStart, { target: { value: '2' } });
  fireEvent.change(yEnd, { target: { value: '2' } });

  // validation message should appear
  const msg = await screen.findByText(/\|y\| must be > 0/i);
  expect(msg).not.toBeNull();

  const origBtn = screen.getByText(/Check original/i) as HTMLButtonElement;
  const pumpBtn = screen.getByText(/Check pumped/i) as HTMLButtonElement;
  expect(origBtn.disabled).toBe(true);
  expect(pumpBtn.disabled).toBe(true);

  // now set y start to 0 and y end to a value that makes |xy| > p
  fireEvent.change(yStart, { target: { value: '0' } });
  fireEvent.change(yEnd, { target: { value: '6' } });

  const msg2 = await screen.findByText(/\|xy\| must be ≤ p/i);
  expect(msg2).not.toBeNull();
  expect(origBtn.disabled).toBe(true);
  expect(pumpBtn.disabled).toBe(true);
});
