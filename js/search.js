$(function(){

  //定义全局缓存对象
  var cacheObj = {};

  //定义延时器的id
  var timer = null;
  //定义防抖的函数
  function debounceSearch(kw){
    timer = setTimeout(function(){
      getSuggestList(kw);
    }, 500)
  }

  //为输入框绑定keyup事件
  $('#ipt').on('keyup', function(){
    //清空timer
    clearTimeout(timer);
    var keywords = $(this).val().trim();
    if(keywords.length <= 0)
      return $('#suggest-list').empty().hide();

    //先判断缓存中是否有数据
    if(cacheObj[keywords]){
      return renderSuggestList(cacheObj[keywords]);
    }

    //TODO:获取搜索建议列表
    //console.log(keywords);
    debounceSearch(keywords);
  })

  function getSuggestList(kw) {
      $.ajax({
      // 指定请求的 URL 地址，其中，q 是用户输入的关键字
      url: 'https://suggest.taobao.com/sug?q=' + kw,
      // 指定要发起的是 JSONP 请求
      dataType: 'jsonp',
      // 成功的回调函数
      success: function(res) { 
			// console.log(res) 
			renderSuggestList(res);
		}
    })
 }

 //渲染UI结构
 function renderSuggestList(res){
 	if(res.result.length <= 0){
 		return $('#suggest-list').empty().hide();
 	}
 	var htmlStr = template('tpl-suggestList', res);
 	$('#suggest-list').html(htmlStr).show();

  //获取到用户输入的内容，当做键
  var k = $('#ipt').val().trim();
  //需要将数据作为值来进行缓存
  cacheObj[k] =res;

 }

})