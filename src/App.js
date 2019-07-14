import React from 'react';
import './App.css';
import Select from "react-select";
import DatePicker from "react-datepicker";
import Container from 'muicss/lib/react/container';
import Row from 'muicss/lib/react/row';
import Col from 'muicss/lib/react/col';
import Button from 'muicss/lib/react/button';

import "react-datepicker/dist/react-datepicker.css";

class App extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.updateConvertValue = this.updateConvertValue.bind(this);
    this.getCurrencies = this.getCurrencies.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.switchCurr = this.switchCurr.bind(this);
    this.getCurrencies();
    this.state = {
      tecajDate: new Date(),
      convertValue: 1,
      firstCurr: null,
      secondCurr: null,
      convertedValue: '',
      options: ''
    };
  }

  getCurrencies() {
    fetch('http://localhost:8080/currencies', {
      method: 'GET',
      headers : {
        'Accept': 'application/json'
      }
    }).then((res) => res.json()).then((resJson) => {
      this.setState({
        options: resJson,
        secondCurr: resJson.filter(obj => {
          return obj.value === 'HRK';
        })
      });
      console.log(this.state.options);
    }).catch((err) => {
      console.log(err);
    })
  }

  handleClick() {
    this.validateForm();
  }

  postRequest() {
    fetch('http://localhost:8080/convert', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'firstCurr': this.state.firstCurr !== null ? this.state.firstCurr.value : 'HRK',
        'secondCurr': this.state.secondCurr.value,
        'value': this.state.convertValue,
        'conversionDate': this.state.tecajDate.toISOString().substring(0,10)
      }
    }).then((res) => res.json()).then((resJson) => {
      this.setState({
        convertedValue: resJson
      })
    }).catch((err) => {
      console.log(err);
    })
  }

  validateForm() {
    console.log('In validate');
    let errMsg = '';
    if (this.state.firstCurr === null || this.state.firstCurr === undefined) {
      errMsg = errMsg + 'Molim unesite valutu iz koje konvertirate iznos\r\n';
    }
    console.log(errMsg);
    if (errMsg === '') {
      this.postRequest();
    } else {
      alert(errMsg);
    }
  }

  updateConvertValue(e) {
    this.setState({
      convertValue: e.target.value
    });
  }

  firstCurrChange = (firstCurr) => {
    this.setState({firstCurr});
    console.log(firstCurr);
  };

  secondCurrChange = (secondCurr) => {
    this.setState({secondCurr});
    console.log(secondCurr);
  };

  resetForm() {
    this.setState({
      tecajDate: new Date(),
      convertValue: 1,
      firstCurr: null,
      secondCurr: null,
      convertedValue: '',
      options: ''
    });
    this.getCurrencies();
  }

  switchCurr() {
    let tempFirst = this.state.firstCurr;
    let tempSecond= this.state.secondCurr;
    this.setState({
      firstCurr: tempSecond,
      secondCurr: tempFirst
    });
  }

  render() {
    let {firstCurr} = this.state;
    let {secondCurr} = this.state;

    return (
        <Container fluid={true}>
          <Row>
            <Col md="12">
              <h1>Currency Converter</h1>
            </Col>
          </Row>
          <Row>
            <Col md="4">
              <label htmlFor="datum" />Datum:
              <Row>
                <DatePicker id="datum" selected={this.state.tecajDate} dateFormat="yyyy-MM-dd"
                            onChange={day => this.setState({tecajDate: day != null ? day : new Date()})}/>
              </Row>
            </Col>
            <Col md="4">
              <label htmlFor="convertValue" /> Iznos:
              <Row>
                <input type="number" id='convertValue' value={this.state.convertValue} onChange={this.updateConvertValue}/>
              </Row>
            </Col>
            <Col md="4">
              <label />Iz valute:
              <Row>
                <Select value={firstCurr} options={this.state.options} onChange={this.firstCurrChange} />
              </Row>
            </Col>
            <Col md="4">
              <label />U valutu:
              <Row>
                <Select value={secondCurr} options={this.state.options} onChange={this.secondCurrChange} />
              </Row>
            </Col>
            <Col md="4">
              <label />Konvertirani iznos:
              <Row>
                <input type='number' id='output' value={this.state.convertedValue} disabled />
              </Row>
            </Col>
            <Col>
              <Button color="primary" className='button' id='submitBtn' onClick={this.handleClick}>Konvertiraj</Button>
            </Col>
            <Col>
              <Button color="primary" className='button' id='switchBtn' onClick={this.switchCurr}>Zamijeni valute</Button>
            </Col>
            <Col>
              <Button color="secondary" className='button' id='resetBtn' onClick={this.resetForm}>Resetiraj formu</Button>
            </Col>
          </Row>
        </Container>
    )
  }
}

export default App;
