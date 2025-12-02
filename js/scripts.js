const gallery = document.getElementById('gallery');
let employees = [];

/*
 loads 12 employees into employees[] and displays them with loadEmployees();
*/
async function getEmployees(){
   try{   
    const response = await fetch('https://randomuser.me/api/?results=12&nat=us');
        if(response.ok){
            data = await response.json();
            //console.log(data.results);
            employees = data.results;
            loadEmployees(data.results);
        } else{
            throw new Error('HTTP Error! status: ' + response.status );
        }

   }catch(error){
        console.log('An error occured: ' + error);
   }

}
/*
    adds the search input and button to the page
*/
let searchHTML=`
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>
`;
document.querySelector('.search-container').insertAdjacentHTML('beforeend', searchHTML);
const search = document.getElementById('search-input');

/*
    loads employees into DOM with insertAdjacentHTML
*/
function loadEmployees(employeesFilter){
    gallery.innerHTML ='';
    if(employeesFilter.length>0){
            employeesFilter.forEach(employee => {
                let galleryHTML = `
                    <div class="card">
                            <div class="card-img-container">
                                <img class="card-img" src="${employee.picture.medium}" alt="profile picture">
                            </div>
                            <div class="card-info-container">
                                <h3 id="name" class="card-name cap" data-fullname="${employee.name.first} ${employee.name.last}">${employee.name.first} ${employee.name.last}</h3>
                                <p class="card-text">${employee.email}</p>
                                <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
                            </div>
                        </div>
                `;
                gallery.insertAdjacentHTML('beforeend', galleryHTML);
        });
    }
    else{
        gallery.innerHTML = '<h2>No employees found</h2>';
    }        
}

/*
    loads the modal with employee information using insertAdjacentHTML
*/
function loadModal(employee){
    if(employee){
        const dobTimeObj = new Date(employee.dob.date);
        const dobFormatted = dobTimeObj.toLocaleDateString();
        //console.log(dobFormatted);
        modalHTML = `
                    <div class="modal-container">
                    <div class="modal">
                        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                        <div class="modal-info-container">
                            <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
                            <h3 id="name" class="modal-name cap" data-fullname="${employee.name.first} ${employee.name.last}">${employee.name.first} ${employee.name.last}</h3>
                            <p class="modal-text">${employee.email}</p>
                            <p class="modal-text cap">${employee.location.city}</p>
                            <hr>
                            <p class="modal-text">${employee.phone}</p>
                            <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}</p>
                            <p class="modal-text">Birthday: ${dobFormatted}</p>
                        </div>
                    </div>
    
                    <div class="modal-btn-container">
                        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                        <button type="button" id="modal-next" class="modal-next btn">Next</button>
                    </div>
                </div>
        `;   
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
}
/*
    Handles logic for searching employees by First and Last name
*/
function searchEmployees(){
        searchTerm = search.value.toLowerCase();
        let employeesFilter = [];
        //console.log(employees);
        employees.forEach(employee => {
            let fullname = employee.name.first +' '+ employee.name.last;
            fullname=fullname.toLowerCase();
            if(fullname.includes(searchTerm)){
                employeesFilter.push(employee);
            }
        });
        return employeesFilter;
}

/*
    handles logic for the modal buttons previous and next 
    using for of to find current employee in employees[]
    and returns index of next or prev employee
*/
function nextPrev(direction){
    employeeName = document.querySelector('.modal-name').dataset.fullname.trim();
   // console.log('employee name: ' + employeeName);
    for(const [index, employee] of employees.entries()){
        const fullname = employee.name.first + ' ' + employee.name.last;   
        // console.log(employee+ ' index: ' +index);
        if( fullname === employeeName && index!==0 && direction === 'prev'){
            //  console.log('fullname matched! '+employee.name.first);
            let prevEmployee = employees[index-1];
            //  console.log('employee from match prev: '+prevEmployee.name.first);
                return prevEmployee;
        }
        else if( fullname === employeeName && index<employees.length-2 && direction === 'next'){
            let nextEmployee = employees[index+1]
            return nextEmployee;
        }
    }
}

/*
    handles logic to find employee from card click or modal button 
    and returns it
*/
function findEmployee(e, type){
    let employeeCard = e.target.closest('.card');
    //console.log('employee card: '+employeeCard)
    if(type === 'modalprev'){
            const employee = nextPrev('prev');
           return employee;
    }  
    else if(type==='modalnext'){
        const employee = nextPrev('next');
        return employee;
    }
    //console.log(employeeCard);
    if(employeeCard){
        const employeeName = employeeCard.children[1].children[0];
        //console.log(employeeName);
        const employee = employees.find( 
            (employee) => (employee.name.first + ' ' + employee.name.last) === employeeName.textContent
        );
        //console.log(employee);
        return employee;
    }

}

getEmployees();

// calls findEmployee and loads the modal
gallery.addEventListener('click', (e) => {
    let employee = findEmployee(e);
    //console.log(employee);
    loadModal(employee);
});

//logic for modal button clicks
document.body.addEventListener('click', (e) => {
        
    if(e.target.closest('#modal-close-btn')){
        document.querySelector('.modal-container').remove();
    }
    else if(e.target.closest('#modal-prev')){
        let employee = findEmployee(e, 'modalprev');
        document.querySelector('.modal-container').remove();
        //console.log(employee);
        loadModal(employee);
    }
    else if(e.target.closest('#modal-next')){
        let employee = findEmployee(e, 'modalnext');
        document.querySelector('.modal-container').remove();
        loadModal(employee);
    }
});

//keyup search listener
search.addEventListener('keyup', (e) => {
        let employeesFilter = searchEmployees();
        loadEmployees(employeesFilter);
});

//submit button search listener
document.getElementById('search-submit').addEventListener('submit', (e) => {
    e.preventDefault();
    let employeesFilter = searchEmployees();
    loadEmployees(employeesFilter);
});


