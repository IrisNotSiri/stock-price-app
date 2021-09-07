import { render, screen } from '@testing-library/react';
import App from './App';
import { shallow } from "enzyme";
import '@testing-library/jest-dom';
import Dashboard from './dashboard/dashBoard';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

it("renders without crashing", () => {
  shallow(<App />);
});

it("render headers", () => {
  const dashboard = shallow(<Dashboard />);
  const timeZone = <h1>Time Zone</h1>;
  const startTime = <h1> Start Datetime</h1>;
  const endTime = <h1> End Datetime</h1>;
  expect(dashboard.contains(timeZone)).toEqual(true);
  expect(dashboard.contains(startTime)).toEqual(true);
  expect(dashboard.contains(endTime)).toEqual(true);
});

