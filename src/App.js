import 'date-fns';
import React from 'react';
import ApiCalendar from 'react-google-calendar-api';
import {Container} from '@material-ui/core';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardTimePicker} from '@material-ui/pickers';
import './App.css'

const calendarID = '9q169grlibltrui34440mr9au8@group.calendar.google.com';

export default function EventCreator() {
    const [selectedStartDate, setSelectedStartDate] = React.useState(new Date('2020-01-01T00:00:00'));
    const [selectedEndDate, setSelectedEndDate] = React.useState(new Date('2020-01-01T00:00:01'));
    const [eventTitle, setEventTitle] = React.useState('');
    const [eventDesc, setEventDesc] = React.useState('');
    const [isEmpty, setEmpty] = React.useState(false);
    const [isError, setError] = React.useState(false);
    const [isSuccess, setSuccess] = React.useState( false );
    const [errMessage, setErrMessage] = React.useState('');
    const [loginRequired, setLoginRequired] = React.useState(false);

    const handleChange = (event) => {
        switch (event.target.id) {
            case 'title': setEventTitle(event.target.value); console.log('Title: ', event.target.value); if(!event.target.value) setError(true); else setError(false); setSuccess(false); break;
            case 'description': setEventDesc(event.target.value); console.log('Description: ', event.target.value); setSuccess(false); break;
            default: break;
        }
    };

    const handleStartDateChange = date => {
        setSelectedStartDate(date.toISOString());
        console.log('Start datetime: ', date.toISOString());
    };

    const handleEndDateChange = date => {
        setSelectedEndDate(date.toISOString());
        console.log('End datetime: ', date.toISOString());
    };

    function event(){
        if(eventTitle){
            setEmpty(false);
            const event = {
                end: {
                    'dateTime': selectedEndDate,
                },
                start: {
                    'dateTime': selectedStartDate,
                },
                summary: eventTitle,
                description: eventDesc
            };
            ApiCalendar.createEvent(event, calendarID)
                .then((result) => {
                    console.log('GOOGLE CALENDAR API RESPONSE: ', result);
                    setError(false);
                    setSuccess(true);
                    setLoginRequired(false);
                })
                .catch((error) => {
                    console.log('GOOGLE CALENDAR API ERROR: ', error);
                    setErrMessage(error.result.error.message);
                    setError(true);
                    setSuccess(false);
                    if(error.result.error.message === 'Login Required') setLoginRequired(true);
                });
        } else setEmpty(true);
    }

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Container className='container'>
                <h1>Simple event creator</h1>
                <form>
                    { !isEmpty ? <TextField
                        id='title'
                        className='textfield'
                        label="Event title"
                        value={eventTitle}
                        onChange={handleChange}
                    /> : <TextField
                        error
                        helperText="Please set the data"
                        id='title'
                        className='textfield'
                        label="Event title"
                        value={eventTitle}
                        onChange={handleChange}
                    />
                    }
                    <TextField
                        id='description'
                        className='textfield'
                        multiline
                        rows='3'
                        label="Event description"
                        value={eventDesc}
                        onChange={handleChange}
                    />
                    <div className='datetime-container'>
                        <div className='datetime-picker-box'>
                            <KeyboardDatePicker
                                format="MM/dd/yyyy"
                                margin="normal"
                                id="startDateTime"
                                label="Start event date"
                                value={selectedStartDate}
                                onChange={handleStartDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                            <KeyboardTimePicker
                                readOnly
                                margin="normal"
                                id="startDateTime"
                                label="Start event time"
                                value={selectedStartDate}
                                onChange={handleStartDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change time',
                                }}
                            />
                        </div>
                        <div className='datetime-picker-box'>
                            <KeyboardDatePicker
                                format="MM/dd/yyyy"
                                margin="normal"
                                id="endDateTime"
                                label="End event date"
                                value={selectedEndDate}
                                onChange={handleEndDateChange}
                            />
                            <KeyboardTimePicker
                                margin="normal"
                                id="endDateTime"
                                label="End event time"
                                value={selectedEndDate}
                                onChange={handleEndDateChange}
                            />
                        </div>
                    </div>
                    <Button
                        variant='contained'
                        color='primary'
                        className='button'
                        onClick={event}
                    >
                        CREATE EVENT
                    </Button>
                </form>
            </Container>
            { isSuccess ? <h2 style={{color: "green"}}>Event was created successfully!</h2> : isError ? loginRequired ? <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}> <h2 style={{color: "red"}}>Error: {errMessage}</h2> <Button
                variant="contained"
                color="primary"
                className='button'
                onClick={ApiCalendar.handleAuthClick()}
            >
                sign-in
            </Button> </div> : <h2 style={{color: "red"}}>Error: {errMessage}</h2> : null }
        </MuiPickersUtilsProvider>
    );
}