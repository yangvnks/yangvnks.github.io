function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', '/posts/test.json', true); 
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

 loadJSON(function(response) {
  // Parse JSON string into object
    var actual_JSON = JSON.parse(response);

    var all_posts= actual_JSON['posts'];

    //Create 'post' section where articles are added
    var posts_div = document.createElement('div');
    posts_div.className = 'posts';


    for (x in all_posts){
      current_post=all_posts[x]

      var article_div = document.createElement('article');
      var img = document.createElement('img');
      var aref = document.createElement('a');
      var title = document.createElement('h3');
      var text = document.createElement('p');
      var aref_li = document.createElement('a');
      var li =  document.createElement('li');
      var ul =  document.createElement('ul');

      /* Variable data*/
      title.innerHTML += current_post['Title'];
      text.innerHTML += current_post['Description'];
      img.src = current_post['Img-Link'];
      aref.href=current_post['Link'];
      aref_li.href=current_post['Link'];

      /* Static part */
      aref.className='image';
      aref.appendChild(img);
      aref_li.className = "button";
      aref_li.innerHTML+="More";
      ul.className= "actions";


      /* Arranging the data*/
      document.getElementsByTagName('section')[1].appendChild(posts_div);
      posts_div.appendChild(article_div);
      li.appendChild(aref_li);
      ul.appendChild(li);
      article_div.appendChild(aref)
      article_div.appendChild(title);
      article_div.appendChild(text);
      article_div.appendChild(ul);

      /* Create dummy space*/
      if (x == all_posts.length-1 && all_posts.length % 2 != 0){
        var article_div2 = document.createElement('article');
        posts_div.appendChild(article_div2);
      }
      }
      
});

