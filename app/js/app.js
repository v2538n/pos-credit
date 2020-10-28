(function($){
	$(document).ready(function(){ /* document.addEventListener('DOMContentLoaded', function(){*/
		

	function pfTabs(){
		$('.portfolio__tab').click(function(){
			$(this).addClass('active').siblings().removeClass('active');
		});
	}

	pfTabs();

	/* Динамическое изменение высоты изображения в секции portfolio, 
	при ширине экрана < 600px */	
		
		$(function() {
		    $(window).on('load resize', function() {
		        var window_width = $(window).width();

		        var 
		      		pf_image = $('.portfolio__image'),
		      		basic_pf_image_padding = 16, 
		        	basic_pf_image_height  = 311;

		        if(window_width < 600) {
		        	console.log('ww < 600 ' + window_width);
		        	 var 
			        	pf_image_width   = pf_image.width(),
			        	pf_image_height  = (pf_image_width / 100) * 57.4, // Знаем, что соотношение сторон подложки = w: 42.6%; h: 57.4%;
			        	pf_image_padding = (pf_image_height / 100) * 5;   // Знаем, что отступ сверху равен 5% от высоты подложки 

			        pf_image.height(pf_image_height);
			        pf_image.css({'padding-top': pf_image_padding});
		        } else {
		        	console.log('ww > 600');

		        	pf_image.height(basic_pf_image_height - basic_pf_image_padding); // Прибавляет к базовой высоте, высоту паддинга, игнорируя свойство box-sizing, по-этому, вычитаем паддинг.
		        	pf_image.css({'padding-top': basic_pf_image_padding});
		        }
		       
		    });
		});

	/* ----------------------------------------------------------------------------------------- */


	/* Burger menu */

		function burgerMenu(){
			$('.burger').click(function(){
				$('.burger, .header__menu').toggleClass('active');
				$('body').toggleClass('lock');

			});

			$('.header__menu').click(function(eventObject){
				$('.burger, .header__menu').removeClass('active');
				$('body').removeClass('lock');
				
				/*if(!$(eventObject.target).hasClass('active')){
					
				} else {
					console.log($(eventObject.target));
				}*/
			
			});
		}

		burgerMenu();

	/* ----------------------------------------------------------------------------------------- */

	
	/* Анимация для вернхнего меню, при скролле страницы */

		function scrollAnimation(){
			const animateTrigger = $('.header');
			const animateTriggerHeight = animateTrigger.outerHeight(true);

			const animateTarget  = $('.header__top-line');
			const animateTargetHeight = animateTarget.outerHeight(true);


			window.addEventListener('scroll', animateOnScroll);

			function animateOnScroll(params){
				
				if(pageYOffset > animateTriggerHeight){
					animateTarget.removeClass('animation_backward');
					animateTrigger.addClass('animation_active');
				} 
				else if (animateTrigger.hasClass('animation_active')) {
					animateTrigger.removeClass('animation_active');
					animateTarget.addClass('animation_backward');
				}
			}

			function offset(el){
			 	const rect = el.getBoundingClientRect(),
			 		scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
			 		scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			 	return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
			 }

			setTimeout(() => {
			 	animateOnScroll();
			}, 300);
		}

		scrollAnimation();


		$('.header__menu-list').children('a').click(function(){
			$(this).addClass('active').siblings().removeClass('active');
		});

	/* ----------------------------------------------------------------------------------------- */

		function contactForm(){
			var inputsValue = [],
				input = $('.contact__input');

/* Перебираем все инпуты из формы контактов 
и сохраняем значение value в массив */

			input.each(function(){
				var 
					inputName = $(this).attr('name');

				inputsValue[inputName] = $(this).val();	
			});



/* Поведение при фокусе. 
Если input.value совпадает с исходным значением, то стираем */

			input.focus(function(){
				
				var 
					inputName  = $(this).attr('name'),
					inputValue = $(this).val();

				if(inputValue === inputsValue[inputName]) {
					$(this).val('');
				}
			});

/* Поведение при потери фокуса. 
Если input.value пустой, то вписываем исходное значение */

			input.blur(function(){
				
				var
					inputName  = $(this).attr('name'),
					inputValue = $(this).val();

				if(inputValue === '') {
					$(this).val(inputsValue[inputName]);
				}

			});
		}

		contactForm();

/* ---------------------------------------------------------------------------------------------------------- */

	const contactForm = $('#contactForm');

	contactForm.bind('submit', formSend); /* addEventListener('submit', formSend);*/

	async function formSend(e) {
		e.preventDefault(); 

		let error = formValidate(contactForm);

		let formData = new FormData(contactForm); // данные из полей формы

		if(error === 0){
			contactForm.addClass('_sending'); /* contactForm.classList.add('_sending');*/
			
			let response = await fetch('sendmail.php', {
				method: 'POST',
				body: formData;
			});

		/*	let response = await $.post({
				type: "POST",
				url: "sendmail.php",
				data: {
					body: formData;
				}
			});
*/
			if(response.ok) {
				let result = await response.json();
				alert(result.message);
				form.reset();
				contactForm.removeClass('_sending'); /* contactForm.classList.remove('_sending');*/
			} else {
				alert('Send error');
				contactForm.removeClass('_sending'); /*.contactForm.classList.remove('_sending');*/
			}
		} else {
			alert('Необходимо корректно заполнить все обязательные поля формы!');
		}
	}

	function formValidate(contactForm){
		let error   = 0;
		let formReq = $('._req'); /*document.querySelectorAll('._req');*/ 

		for (let index = 0; index < formReq.length; index++){
			const input = formReq[index];
			formRemoveError(input);

		/*if(input.classList.contains('_email')){*/
			if(input.hasClass('_email')) {
				if(emailTest(input)){
					formAddError(input);
					error++;
				}
			} else if (input.hasClass('_name')) {
				if(nameTest(input)){
					formAddError(input);
					error++;
				}
			} else {
				if(input.val() === ''){ /*if(input.value === '')*/
					formAddError(input);
				error++;
				}
			}
		}
	}

	function formAddError(input){
		/* input.parent().class() = input.parentElement.classList*/
		input.addCLass('_error');
	}

	function formRemoveError(input){
		input.removeCLass('_error');
	}

	function emailTest(input) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value); // функция валидации, собственно 
	}

	function nameTest(input) {
		return !/^[\wа-я]{3,10}$/gi.test(input.value); // функция валидации, от 3 до 10 символов русс и англ алфавита
	}



/* ---------------------------------------------------------------------------------------------------------- */

	});
})(jQuery);

/*document.addEventListener("DOMContentLoaded", function() {

	const animateTrigger = document.getElementsByClassName('header');
	const animateTriggerHeight = animateTrigger[0].offsetHeight;

	const animateTarget  = document.getElementsByClassName('header__top-line');
	const animateTargetHeight = animateTarget[0].offsetHeight;


	window.addEventListener('scroll', animateOnScroll);

	function animateOnScroll(params){
		
		if(pageYOffset > animateTriggerHeight){
			animateTarget[0].classList.remove('animation_backward');
			animateTrigger[0].classList.add('animation_active');
		} else if (animateTrigger[0].classList.contains('animation_active')) {
			animateTrigger[0].classList.remove('animation_active');
			animateTarget[0].classList.add('animation_backward');
		}
		
	}

	function offset(el){
	 	const rect = el.getBoundingClientRect(),
	 		scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
	 		scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	 	return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
	 }

	setTimeout(() => {
	 	animateOnScroll();
	 }, 300);

});
*/