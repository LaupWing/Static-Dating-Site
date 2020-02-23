class imageLoader{
    constructor(){
        this.input = document.querySelector('input[type="file"]')
        this.input.addEventListener('change',()=> this.readFile(this))
    }
    readFile(input){
        if(input.input.files && input.input.files[0]){
            const reader = new FileReader()
            reader.onload = function (e){
                document.querySelector('img').src = e.target.result
            }
            reader.readAsDataURL(input.input.files[0]);
        }
    }
}

class CheckDone{
    constructor(){
        this.stepsContainer  = document.querySelector('.progress')
        this.inputs          = document.querySelectorAll('input')
        this.inputs.forEach(input=>input.addEventListener('input', this.checkInput.bind(this))) 
    }
    checkInput(e){
        const el = this.stepsContainer.querySelector(`.${e.target.name}`)
        if(!el) return
        if(e.target.value !== '' && !el.classList.contains('done')){
            el.classList.add('done')
            const checkEveryDone = Array.from(el.closest('.step').querySelectorAll('p'))
                .every(p=>p.classList.contains('done'))
            if(checkEveryDone){
                el.closest('.step').querySelector('svg').classList.add('done')
            }
        }else if(e.target.value === ''){
            el.classList.remove('done')
            el.closest('.step').querySelector('svg').classList.remove('done')
        }
    }
}

class nextSection{
    constructor(){
        this.nextBtn     = document.querySelector('button.next')
        this.backBtn     = document.querySelector('button.back')
        this.currentStep = document.querySelector('h2 span')
        this.form        = document.querySelector('form')

        this.nextBtn.addEventListener('click', this.next.bind(this))
        this.backBtn.addEventListener('click', this.back.bind(this))
        this.disableButton()
    }
    next(){
        const done   = this.form.querySelectorAll('.done')
        const fields = this.form.querySelectorAll('.field')
        const ended  = ()=>{
            fields[done.length+1].classList.add('visible')
            fields[done.length].removeEventListener('transitionend', ended)
            this.updateCurrent()
            this.disableButton()
        }

        fields[done.length].addEventListener('transitionend', ended)
        fields[done.length].classList.add('done')
    }
    back(){
        const done   = this.form.querySelectorAll('.done')
        const fields = this.form.querySelectorAll('.field')
        const ended  = ()=>{
            fields[done.length-1].classList.remove('done')
            fields[done.length].removeEventListener('transitionend', ended)
            this.updateCurrent()
            this.disableButton()
        }
        if(done.length === 0){
            return
        }
        fields[done.length].addEventListener('transitionend', ended)
        fields[done.length].classList.remove('visible')
    }
    updateCurrent(){
        const done = this.form.querySelectorAll('.done')
        this.currentStep.textContent = ` ${done.length+1}/4`
    }
    disableButton(){
        const done   = this.form.querySelectorAll('.done')
        const fields = this.form.querySelectorAll('.field')
        
        if(done.length === 0){
            this.backBtn.disabled = true
        }
        if(done.length > 0){
            this.backBtn.disabled = false
        }
        if((done.length+1) === fields.length){
            this.nextBtn.disabled = true
        }
        if((done.length+1) < fields.length){
            this.nextBtn.disabled = false
        }
    }
}

class EnableSubmit{
    constructor(){
        this.form      = document.querySelector('form')
        this.submit    = document.querySelector('button[type="submit"]')
        this.inputs    = document.querySelectorAll('input')
        this.radioBtns = document.querySelectorAll('input[type="radio"]')
        this.inputs.forEach(input=>input.addEventListener('input', this.userInput.bind(this)))
        document.querySelector('button.next').addEventListener('click', this.userInput.bind(this))
        this.reachedEnd = false
    }
    userInput(){
        const done = this.form.querySelectorAll('.done')
        const fields = this.form.querySelectorAll('.field')
        const empty = Array.from(this.inputs).some(input=>input.value === '')
        const noneChecked = Array.from(this.radioBtns).every(radio=>!radio.checked)
        
        if((done.length+1) === fields.length){
            this.reachedEnd = true
        }
        if(this.reachedEnd && !empty && !noneChecked){
            this.submit.disabled = false
        }
    }
}

class slider{
    constructor(){
        this.minAge = document.querySelector('input[name="minAge"]')
        this.maxAge = document.querySelector('input[name="maxAge"]')

        this.minAge.addEventListener('input', this.changeVal)
        this.maxAge.addEventListener('input', this.changeVal)
    }
    changeVal(e){
        const display = e.target.parentElement.querySelector('p span')
        display.textContent = e.target.value
    }
}

class autoAdjust{
    constructor(){
        this.ageInput = document.querySelector('input[name="age"]')
        this.ageInput.addEventListener('change', this.changeVal)
    }
    changeVal(e){
        const threshhold = Math.round(Number(e.target.value)*0.15)
        const minAge = document.querySelector('input[name="minAge"]')
        const maxAge = document.querySelector('input[name="maxAge"]')

        const changeMinAge = Number(e.target.value) -threshhold
        const changeMaxAge = Number(e.target.value) + threshhold

        const minAgeDisplay = this.form.querySelector('.minAge p span')
        const maxAgeDisplay = this.form.querySelector('.maxAge p span')
        
        minAge.value = changeMinAge < 18 ? 18 : changeMinAge
        maxAge.value = changeMaxAge < 18 ? 18 : changeMaxAge
        
        minAgeDisplay.textContent = changeMinAge<18 ? 18 : changeMinAge
        maxAgeDisplay.textContent = changeMaxAge<18 ? 18 : changeMaxAge
    }
}

const init = ()=>{
    new imageLoader()
    new nextSection()
    new slider()
    new EnableSubmit()
    new autoAdjust()
    new CheckDone()
}

init()