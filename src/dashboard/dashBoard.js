import React, { Component, Fragment } from "react";
import { Chart } from "react-google-charts";
import moment from "moment-timezone";
import DateTimePicker from 'react-datetime-picker';
import './dashBoard.css';
import stockList from './stockPrice.json';

class Dashboard extends Component {
  state = {
    startDateTime: '',
    endDateTime: '',
    stockData: [],
    filteredStockData: [],
    selectedTimeZone: '',
  }

  constructor(props) {
    super(props);
    this.onStartDatetimeChange = this.onStartDatetimeChange.bind(this);
    this.onEndDatetimeChange = this.onEndDatetimeChange.bind(this);
    this.onSelectTimeZone = this.onSelectTimeZone.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    const rawStockData = stockList['list'];
    const parsedStockData = rawStockData.map((stockItem) => {
      return [new Date(stockItem['time']), Math.floor(parseFloat(stockItem['price']))];
    });
    this.setState({
      stockData: parsedStockData,
      startDateTime: new Date('2020-03-01 00:00:00'),
      endDateTime: new Date('2020-7-31 23:00:00'),
      selectedTimeZone: 'UTC'
    }, () => {
      this.filterStockData(this.state.startDateTime, this.state.endDateTime);
    });
  }

  onStartDatetimeChange(newTime) {
    console.log('start', newTime);
    this.setState({ startDateTime: newTime });
  }
  onEndDatetimeChange(newTime) {
    console.log('end', newTime);
    this.setState({ endDateTime: newTime });

  }

  filterStockData(startTime, endTime) {
    this.setState({
      filteredStockData: this.state.stockData.filter((stockItem) => {
        let stockTime = new Date(stockItem[0]);
        return (stockTime >= new Date(startTime) && stockTime <= new Date(endTime));
      })
    });
  }

  onSelectTimeZone(event) {
    console.log(event.target.value)
    this.setState({ selectedTimeZone: event.target.value });
  }

  handleUpdate() {
    if (this.state.endDateTime <= this.state.startDateTime) {
      window.alert("the time interval is not valid.");
    } else {
      this.filterStockData(this.state.startDateTime, this.state.endDateTime);
    }
    console.log('current timezone', this.state.selectedTimeZone);
    console.log('change timezone', moment.utc(this.state.startDateTime).tz(this.state.selectedTimeZone));
    if (this.state.selectedTimeZone === 'America/Toronto' || this.state.selectedTimeZone === 'Asia/Tokyo') {
      this.setState({
        startDateTime: moment.utc(this.state.startDateTime).tz(this.state.selectedTimeZone)._d,
        endDateTime: moment.utc(this.state.endDateTime).tz(this.state.selectedTimeZone)._d,
      }, () => {
        this.filterStockData(this.state.startDateTime, this.state.endDateTime);
      });
    } else {
      this.filterStockData(this.state.startDateTime, this.state.endDateTime);
    }
  }


  render() {
    return (
      <Fragment>
        <div className='time-picker-container'>
          <div className='time-pickers'>
            <div className='time-zone'>
              <h1>Time Zone</h1>
              <select onChange={this.onSelectTimeZone}>
                <option value="UTC">UTC</option>
                <option value="America/Toronto">America/Toronto</option>
                <option value="Asia/Tokyo">Japan/Tokyo</option>
              </select>
            </div>
            <div className='start-time'>
              <h1> Start Datetime</h1>
              <DateTimePicker
                yearPlaceholder='yyyy'
                monthPlaceholder='mm'
                dayPlaceholder='dd'
                hourPlaceholder='hh'
                minutePlaceholder='mm'
                secondPlaceholder='ss'
                format='yyyy-MM-dd hh:mm:ss a'
                disableClock={true}
                value={this.state.startDateTime}
                onChange={this.onStartDatetimeChange}
                name='startDatetime'
              />
            </div>
            <div className='end-time'>
              <h1> End Datetime</h1>
              <DateTimePicker
                yearPlaceholder='yyyy'
                monthPlaceholder='mm'
                dayPlaceholder='dd'
                hourPlaceholder='hh'
                minutePlaceholder='mm'
                secondPlaceholder='ss'
                format='yyyy-MM-dd hh:mm:ss a'
                disableClock={true}
                value={this.state.endDateTime}
                onChange={this.onEndDatetimeChange}
                name='endDatetime'
              />
            </div>
            <button onClick={this.handleUpdate} className='submit-button'>
              update
            </button>
          </div>
        </div>
        <div className='chart-container'>
          <Chart
            className='line-chart'
            width={'1500px'}
            height={'800px'}
            chartType="Line"
            loader={<div>Loading Chart</div>}
            data={[
              ['Time', 'Price'],
              ...this.state.filteredStockData
            ]}
            options={{
              chart: {
                title:
                  'Price-time chart',
              },
            }}
            rootProps={{ 'data-testid': '4' }}
          />
          <div>*Data shows in UTC time</div>
        </div>
      </Fragment>
    )
  }
}

export default Dashboard;