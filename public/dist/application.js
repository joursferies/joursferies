!function($){"use strict";$.fn.downCount=function(options,callback){function countdown(){var target_date=new Date(settings.date),current_date=currentDate(),difference=target_date-current_date;if(0>difference)return void(callback&&"function"==typeof callback&&callback());var days=Math.floor(difference/_day),hours=Math.floor(difference%_day/_hour),minutes=Math.floor(difference%_hour/_minute),seconds=Math.floor(difference%_minute/_second);days=String(days).length>=2?days:"0"+days,hours=String(hours).length>=2?hours:"0"+hours,minutes=String(minutes).length>=2?minutes:"0"+minutes,seconds=String(seconds).length>=2?seconds:"0"+seconds;var ref_days=2>days?settings.i18n.day:settings.i18n.days,ref_hours=2>hours?settings.i18n.hour:settings.i18n.hours,ref_minutes=2>minutes?settings.i18n.minute:settings.i18n.minutes,ref_seconds=2>seconds?settings.i18n.second:settings.i18n.seconds;$elem.$days.text(days),$elem.$hours.text(hours),$elem.$minutes.text(minutes),$elem.$seconds.text(seconds),$elem.$days_ref.text(ref_days),$elem.$hours_ref.text(ref_hours),$elem.$minutes_ref.text(ref_minutes),$elem.$seconds_ref.text(ref_seconds),setTimeout(countdown,1e3)}var settings=$.extend({date:null,offset:null,clockDiff:0,i18n:{day:"jour",days:"jours",hour:"heure",hours:"heures",minute:"minute",minutes:"minutes",second:"seconde",seconds:"secondes"}},options);settings.date||$.error("Date is not defined.");var $elem={$days:this.find(".days"),$hours:this.find(".hours"),$minutes:this.find(".minutes"),$seconds:this.find(".seconds"),$days_ref:this.find(".days_ref"),$hours_ref:this.find(".hours_ref"),$minutes_ref:this.find(".minutes_ref"),$seconds_ref:this.find(".seconds_ref")},_second=1e3,_minute=60*_second,_hour=60*_minute,_day=24*_hour,currentDate=function(){var date=new Date(Date.now()+settings.clockDiff),utc=date.getTime()+6e4*date.getTimezoneOffset(),new_date=new Date(utc+36e5*settings.offset);return new_date};countdown(),this.removeClass("invisible")}}(jQuery),function($){"use strict";function defineMainPageBehaviors(){$("body").on("click","tr[data-uri]",function(){window.location.href=$(this).data("uri")}),$("#legal-year-select, #legal-country-select").on("change",function(){loadTable("legal")}),$("#others-year-select, #others-country-select").on("change",function(){loadTable("others")})}function loadTable(category){var $loader=$("#"+category+"-loader"),country=$("#"+category+"-country-select").val(),year=$("#"+category+"-year-select").val();$loader.removeClass("invisible"),$.get([category,country,year].join("/")).then(function(data){$("#table-"+category).fadeOut(500,function(){$(this).replaceWith(data),$loader.addClass("invisible")})})}$(document).ready(function(){window.nextHolidayDate&&($("#countdown").downCount({date:window.nextHolidayDate,offset:1,clockDiff:"number"==typeof window.now&&window.now>0?window.now-Date.now():0},function(){$("body > .content").fadeOut(1e3,function(){window.location.reload()})}),defineMainPageBehaviors())})}(jQuery);