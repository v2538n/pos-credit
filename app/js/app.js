(function($){
	$(document).ready(function(){ 

	/* Burger menu */

		function burgerMenu(){
			$('.burger').click(function(){
			
				$('.burger, .menu').toggleClass('active');
				$('body').toggleClass('lock');

			});

			$('.menu__list').click(function(){
				$('.burger, .menu').removeClass('active');
				$('body').removeClass('lock');
			});
		}

		burgerMenu();

	/*  menu */
	
		$('.menu__item').click(function(){
			$('.menu__item').removeClass('active');
			$(this).addClass('active');
		});

	});
})(jQuery);