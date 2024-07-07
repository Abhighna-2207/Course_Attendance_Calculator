$(document).ready(function() {
    // Initialize datepicker for elements with class 'datepicker'
    $('.datepicker').datepicker({
        format: 'yy-mm-dd',
        autoclose: true,
        todayHighlight: true,
    });

    // Event listener for Enter key press in the numSubjects input field
    $('#numSubjects').keypress(function(event) {
        if (event.which === 13) { // Check if Enter key is pressed
            event.preventDefault(); // Prevent default form submission
            createInputBoxes(); // Call function to create input boxes
        }
    });

    // Event listener for handling Enter key press to navigate through inputs
    $('#attendanceForm').on('keypress', 'input', function(e) {
        if (e.which === 13) { // Check if Enter key is pressed
            e.preventDefault();

            let $inputs = $('input'); // Select all input fields
            let currentIndex = $inputs.index(this); // Get current input index

            // Move to the next input
            let nextIndex = currentIndex + 1;
            if (nextIndex < $inputs.length) {
                $inputs[nextIndex].focus(); // Focus on the next input
            } else {
                // If at the last input, move to the next row's first input
                let $formGroups = $('.form-group');
                let currentFormGroupIndex = $formGroups.index($(this).closest('.form-group'));
                let nextFormGroup = $formGroups.eq(currentFormGroupIndex + 1);
                let $nextInputs = nextFormGroup.find('input');
                if ($nextInputs.length > 0) {
                    $nextInputs[0].focus(); // Focus on the first input of the next row
                } else {
                    // If no next row, trigger the calculation
                    calculateAttendance();
                }
            }
        }
    });

    // Event listener for Create Boxes button click
    $('#createInputBoxes').on('click', function() {
        createInputBoxes();
    });

    // Event listener for Calculate button click
    $('#calculateButton').on('click', function() {
        calculateAttendance();
    });


});

// Function to create input boxes dynamically based on number of subjects
const createInputBoxes = () => {
    let numSubjects = parseInt(document.getElementById('numSubjects').value);

    if (isNaN(numSubjects) || numSubjects <= 0 || numSubjects > 15) {
        alert('Please enter a number of subjects between 1 and 15.');
        return;
    }

    let boxContainer = document.getElementById('boxContainer');
    boxContainer.innerHTML = ''; // Clear previous boxes

    for (let i = 0; i < numSubjects; i++) {
        // Create a container for each row of attended and conducted inputs
        let rowDiv = document.createElement('div');
        rowDiv.className = 'form-row box';

        // Create label for attended input
        let attendedLabel = document.createElement('label');
        attendedLabel.innerText = `Subject ${i + 1}:`;
        attendedLabel.className = 'col-form-label col-md-2';
        rowDiv.appendChild(attendedLabel);

        // Create attended input
        let attendedInput = document.createElement('input');
        attendedInput.type = 'number';
        attendedInput.className = 'form-control col-md-4';
        attendedInput.placeholder = 'Attended';
        attendedInput.name = `attended_${i}`;
        attendedInput.style.width = '150px'; // Set width inline
        rowDiv.appendChild(attendedInput);

        // Create slash between attended and conducted
        let slash = document.createElement('span');
        slash.innerText = ' / ';
        slash.className = 'col-form-label';
        rowDiv.appendChild(slash);

        // Create conducted input
        let conductedInput = document.createElement('input');
        conductedInput.type = 'number';
        conductedInput.className = 'form-control col-md-4';
        conductedInput.placeholder = 'Conducted';
        conductedInput.name = `conducted_${i}`;
        conductedInput.style.width = '150px'; // Set width inline
        rowDiv.appendChild(conductedInput);

        // Append the row div to the container
        boxContainer.appendChild(rowDiv);
    }
};

// Event listener for button click to generate input boxes
document.getElementById('createInputBoxes').addEventListener('click', createInputBoxes);

// Function to count weekdays between two dates, excluding holidays


const countWeekdays = (start, end) => {
    let startDate = new Date(start);
    let endDate = new Date(end);

    if (startDate > endDate) {
        [startDate, endDate] = [endDate, startDate];
    }

    const weekCount = {
        'Monday': 0,
        'Tuesday': 0,
        'Wednesday': 0,
        'Thursday': 0,
        'Friday': 0,
        'Saturday': 0,
        'Sunday': 0
    };

    let currentDate = startDate;

    while (currentDate <= endDate) {
        const weekday = currentDate.toLocaleString('en-US', { weekday: 'long' });
        weekCount[weekday]++;
        currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log('Week Count:', weekCount);

    return [
        weekCount['Monday'],
        weekCount['Tuesday'],
        weekCount['Wednesday'],
        weekCount['Thursday'],
        weekCount['Friday'],
        weekCount['Saturday']
    ];
};
//---------------------------------------------------------------------------------------------------------------------------------------------
// Function to calculate attendance
const calculateAttendance = () => {
    console.log('Calculate button clicked');
    // Get dates and calculate weekdays excluding holidays
    let startDate = new Date(document.getElementById('startDate').value);
    let endDate = new Date(document.getElementById('endDate').value);
    console.log('Start Date:', startDate, 'End Date:', endDate);

    if (isNaN(startDate) || isNaN(endDate)) {
        alert('Please enter both start date and end date.');
        return;
    }

    let classDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    let classesPerDay = [];
    let holidaysPerWeek = [];
    let goal = document.getElementById('flag').value;
    console.log('Goal:', goal);

    if ( startDate >= endDate) {
        alert('Start date must be before end date.');
        return;
    }// Assuming `classDays`, `classesPerDay`, and `holidaysPerWeek` are defined elsewhere

    let isClassDataComplete = true;
    let isHolidayDataComplete = true;
    
    classDays.forEach(day => {
        let classValue = parseInt(document.getElementById(`${day}Classes`).value);
        let holidaysPerDay = parseInt(document.getElementById(`${day}Holidays`).value);
    
        if (isNaN(classValue)) {
            isClassDataComplete = false;
        } else {
            classesPerDay.push(classValue);
        }
    
        if (isNaN(holidaysPerDay)) {
            isHolidayDataComplete = false;
        } else {
            holidaysPerWeek.push(holidaysPerDay);
        }
    });
    
    if (!isClassDataComplete) {
        alert(`Classes conducted per day is incomplete. Please enter values for all days.`);
        return;
    }
    
    if (!isHolidayDataComplete) {
        alert(`Number of public holidays is incomplete. Please enter values for all days.`);
        return;
    }

    
    // Further processing can be done here
    for (let i=0;i<6;i++){
        if (classesPerDay[i]<0){
            alert("Classes conducted per Day cannot be Negative Number");
            return;
        }
    }

    for (i=0;i<6;i++){
        if (holidaysPerWeek[i]<0){
            alert("Public Holidays occurring cannot be Negative Number");
            return;
        }
    }


    console.log('Classes Per Day:', classesPerDay);
    console.log('Holidays Per Week:', holidaysPerWeek);

    let numSubjects = parseInt(document.getElementById('numSubjects').value);
    let totalAttended = 0;
    let totalConducted = 0;

    for (let i = 0; i < numSubjects; i++) {
        let attended = parseInt(document.querySelector(`input[name='attended_${i}']`).value) || 0;
        let conducted = parseInt(document.querySelector(`input[name='conducted_${i}']`).value) || 0;
        totalAttended += attended;
        totalConducted += conducted;
    }
    console.log('Total Attended:', totalAttended);
    console.log('Total Conducted:', totalConducted);


    let totalClasses=totalConducted;
    let weekCount = countWeekdays(startDate, endDate);
    let additionalClasses = 0;


    // Calculate attendance percentage and determine classes to skip or need to attend

    for (let i = 0; i < 6; i++) {
        additionalClasses += classesPerDay[i] * weekCount[i];
    }

    for (let i = 0; i < 6; i++) {
        additionalClasses -= holidaysPerWeek[i] * classesPerDay[i];
    }
    console.log('Additional Classes:', additionalClasses);

    let percent= (goal==1) ? 0.25 :0.35;


    totalClasses += additionalClasses;

    let attendancePercentage=((totalClasses -( totalConducted - totalAttended)) / totalClasses) * 100;
    let userHolidays = Math.floor(percent*totalClasses - ( totalConducted - totalAttended)) ;

    let resultText = `Total No of Classes you can skip for the Semester: ${parseInt(totalClasses/4) }`;

    resultText += `<br>Current Attendance Percentage: ${(totalAttended*100/totalConducted).toFixed(2)}%`;

    if (userHolidays > 0) {
        if (userHolidays > additionalClasses) {
            resultText+= `<br>You can skip <b> ${(additionalClasses)} classes`;
            resultText+= `<br>Your Attendance Percentage by the end of the semester:  ${((totalAttended * 100 / totalClasses).toFixed(2))}`;
        } else {
            resultText+= `<br>You can skip ${(userHolidays)} classes`;
            resultText+= `<br>Attendance Percentage by the end of the semester: ${(((totalAttended + additionalClasses - userHolidays) * 100 / totalClasses).toFixed(2))}`;
        }
        resultText += `<br>You need to attend  ${(Math.max(0, additionalClasses - userHolidays))} classes`;
    } else if (userHolidays < 0) {
        resultText += `<br>Attendance Percentage by the end of the semester: ${(attendancePercentage.toFixed(2))}`;
        resultText += `<br>Less than necessary`;
        resultText += `<br>You need to attend all <b> ${(additionalClasses)} classes`;
    } else {
        resultText += `<br>Attendance Percentage by the end of the semester: ${(attendancePercentage.toFixed(2))}`;
        resultText += `<br>NO more Holidays`;
        resultText += `<br>You need to attend all <b> ${(additionalClasses)} classes`;
    }
    console.log(resultText);
    // Display result// Example of updating inner HTML correctly
    document.getElementById('resultContainer').style.display = 'block';
    document.getElementById('attendancePercentage').innerHTML = "";

};
