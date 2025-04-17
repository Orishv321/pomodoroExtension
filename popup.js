

const enumMessageType = {
    ERROR: 'error',
    SUCCESS: 'success',
    WARNING: 'warning'
}

//global variables
var time = null;
var timeStop = false;
var timeVariables = {
    minute: 0,
    second: 0,
}

//Messages type
const errorMessageDisplay = document.getElementById("error_message_display");
const warningMessageDisplay = document.getElementById("warning_message_display");
const successMessageDisplay = document.getElementById("success_message_display");

//Display Output timer
const displayRemainingTimeDisplay = document.getElementById("display_remaining_time");

//IDS
const pomodoroSelectorSectionID = document.getElementById("pomodoro_selector_section");
const focusCycleSelectorSectionID = document.getElementById('focus_cycle_selector_section');
const directPomodoroSelectorSectionID = document.getElementById('direct_pomodoro_selector_section');
const focusCycleID = document.getElementById('focus_cycle_id');
const directPomodoroID = document.getElementById('direct_pomodoro_id');
const displayTimerButton = document.getElementById("display_timer_button");

//Buttons
const pomSectionButtonID = document.getElementById('pom_section_button');
const startDirectPomodoroID = document.getElementById('start_direct_pomodoro');
const reStartDirectPomodoroID = document.getElementById('re_start_direct_pomodoro');
const displayTimerPause = document.getElementById("display_timer_pause");
const displayTimerPlay = document.getElementById("display_timer_play");
const displayTimerStop = document.getElementById("display_timer_stop");

//Input IDS
const totalTimeDirectID = document.getElementById('total_time_direct_id');
const timeTypeDirectID = document.getElementById('time_type_direct_id');

const restTimeID = document.getElementById('rest_time_id');

//Local Variables
let pomodoroType = null;

function changePomodoroType(event) {
    pomodoroType = event.target.value;
}

function handelPomSectionButton() {
    if (!pomodoroType) warningMessageDisplay.innerText = "Please select a pomodoro type";

    if (!!pomodoroType) pomodoroSelectorSectionID.style.display = "none";

    if (pomodoroType === "focus-cycle") {
        focusCycleSelectorSectionID.style.display = "block";
        directPomodoroSelectorSectionID.style.display = "none";
    }

    if (pomodoroType === "direct-pomodoro") {
        focusCycleSelectorSectionID.style.display = "none";
        directPomodoroSelectorSectionID.style.display = "block";
    }
}

let formValuesDirectType = {
    totalTimeDirect: "",
    timeTypeDirect: "",
    restTime: "",

};


//common Functions
/**
 * Display the Timer functions
 */
function displayTimer() {
    if (Number(timeVariables.minute) > 1 || Number(timeVariables.second) > 1) {
        displayTimerButton.style.display = "block";
    } else {
        displayTimerButton.style.display = "null";
    }
}

/**
 * Display the output timer.
 * Use the global time variables
 */
function displayOutPutTimer(minute, second) {
    timeVariables.minute = minute
    timeVariables.second = second
    displayTimer();
    displayRemainingTimeDisplay.innerHTML = `${timeVariables.minute} : ${timeVariables.second}`;
}

/**
 * Display provided values in warning section.
 * @param {string} valuesToDisplay - receive a string to display value in warning section to test out values.
 * @param {string} type - receive message type enumMessageType.
 */
function checkOutput(valuesToDisplay, type = enumMessageType.WARNING) {
    if (type === enumMessageType.WARNING) warningMessageDisplay.innerText += `\n -->> ${valuesToDisplay}`;
    if (type === enumMessageType.ERROR) errorMessageDisplay.innerText += `\n -->> ${valuesToDisplay}`;
    if (type === enumMessageType.SUCCESS) successMessageDisplay.innerText += `\n -->> ${valuesToDisplay}`;
}

/**
 * Receive input from direct type form and store them in object.
 * @param event default param
 */
function handelInput(event) {
    formValuesDirectType[event.target.name] = event.target.value;
    // checkOutput( `${event.target.name} ->> ${event.target.value}` );
}

/**
 * Convert the time format in minute to make it all same type
 * @param {number} time - time format in number
 * @param {string} timeType - current format type
 * @return {number} convert - minute in number.
 */
const unifyTimeToMinute = (time, timeType) => {
    const checkValid = validateTime(time, timeType)
    if (!checkValid) return null;
    if (timeType === 'hour') {
        return +(time) * 60;
    } else {
        return +(time);
    }
}

const validateTime = (time, timeType) => {
    if (timeType === "hour" && time > 12) {
        checkOutput("Hour type cannot be greater than 12 hours", enumMessageType.ERROR);
        return false;
    }
    if (timeType === "minute" && time > 60) {
        checkOutput("Minute type cannot be greater than 60 minute", enumMessageType.ERROR);
        return false;
    }
    return true;


}

//Manage Time
const startCountDownTimer = (min, sec) => {
    let minute = min;
    let second = sec;

    clearInterval(time);
    time = setInterval(() => {

        if (minute === 0 && second === 0) {
            clearInterval(timer);
            stop = true;
        } else {
            if (second === 0) {
                --minute;
                second = 59;
            } else {
                --second;
            }
        }

        displayOutPutTimer(minute, second);
    }, 1000);
};

function playCountDownTimer() {
    startCountDownTimer(timeVariables.minute, timeVariables.second);
}

function stopCountDownTimer() {
    timeStop = true;
    clearInterval(time);
}

function clearCountDownTimer() {
    clearInterval(time);
    time = null;
    timeStop = false;
    displayOutPutTimer(0, 0)
    displayRemainingTimeDisplay.innerHTML = "";
    displayTimerButton.style.display = "none";
}


//Selected Functions
function submitDirectPomodoro(event) {
    event.preventDefault();

    if (!formValuesDirectType.totalTimeDirect && !formValuesDirectType.restTime) checkOutput("Please enter Total time and Rest time values.", enumMessageType.ERROR);
    if (pomodoroType !== "direct-pomodoro") checkOutput("\nError undefined value selected.", enumMessageType.ERROR);

    const workTime = unifyTimeToMinute(formValuesDirectType.totalTimeDirect, formValuesDirectType.timeTypeDirect);
    const restTime = unifyTimeToMinute(formValuesDirectType.restTime, "minute");

    if (+(workTime) < +(restTime)) checkOutput("The rest time should be less then work time.", enumMessageType.ERROR)

    startCountDownTimer(workTime, restTime)

}

function restartDirectPomodoro() {
    formValuesDirectType = {
        totalTimeDirect: "",
        timeTypeDirect: "",
        restTime: "",
    }
}

function clearMessages() {
    errorMessageDisplay.innerHTML = "";
    warningMessageDisplay.innerHTML = "";
    successMessageDisplay.innerHTML = "";
}

window.onload = () => {
    focusCycleSelectorSectionID.style.display = "none";
    directPomodoroSelectorSectionID.style.display = "none";

    directPomodoroID.onchange = changePomodoroType;
    focusCycleID.onchange = changePomodoroType;

    pomSectionButtonID.onclick = handelPomSectionButton;

    totalTimeDirectID.onchange = handelInput;
    restTimeID.onchange = handelInput;
    timeTypeDirectID.onchange = handelInput;

    startDirectPomodoroID.onclick = submitDirectPomodoro;
    reStartDirectPomodoroID.onclick = restartDirectPomodoro

    displayTimerPause.onclick = stopCountDownTimer;
    displayTimerStop.onclick = clearCountDownTimer;
    displayTimerPlay.onclick = playCountDownTimer;

    displayRemainingTimeDisplay.innerHTML = "";
    displayTimerButton.style.display = "none";
}