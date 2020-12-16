$(document).ready(function(){
  $('.delete-blog').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/blogs/'+id,
      success: function(response){
        alert('Deleting blog');
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});
