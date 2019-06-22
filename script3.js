const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const urlPoster='https://image.tmdb.org/t/p/w500';
function apiSearch(event){
    event.preventDefault();
    const searchText = document.querySelector('.form-control').value;

    if (searchText.trim().length===0){
        movie.innerHTML='<h2 class="col-12 text-center text-danger" >Поле поиска не должно быть пустым</h2>';
         return;
    };
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=ead41c3eaac089640f31601bd088ab4e&languge=ru&query='+ searchText;
    movie.innerHTML='<div class="spinner"></div>';
    fetch(server)
        .then(function(response){
            if ( response.status!== 200){
                return Promise.reject(response);
            }
            return response.json();
        })
    .then(function(output){
        let inner ='';
        if (output.results.length===0){
            inner='<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h2>';
        };
        let imageItem ='';
        output.results.forEach(function (item){
        let nameItem = item.name || item.title;
        let dateItem =  '  ('+(item.first_air_date||item.release_date)+')';

        if (item.poster_path && checkURL(item.poster_path)){
            imageItem =urlPoster+item.poster_path;
        }
        else {
            imageItem ='https://dummyimage.com/500x750/99cccc.gif&text=Image+is+not+found!';
        ;}
        let dataInfo='';
        if (item.media_type!=='person'){
            dataInfo =`data-id="${item.id}" data-type="${item.media_type}"`;
        }
        inner += `
        <div class="col-12 col-md-4 col-xl-3 item">
        <img src=${imageItem} class='img_poster' alt="${nameItem}" ${dataInfo}>
        <h5>${nameItem}</h5>
        <div>${dateItem}</div>
        </div>`;
     });
    movie.innerHTML = inner;  
    addEventMedia();
    })
    .catch(function(error){
        movie.innerHTML='Упс, что-то пошло не так';
        console.error(error);
    });
}

searchForm.addEventListener('submit',apiSearch);

function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
};

function addEventMedia(){
    const media = movie.querySelectorAll('img[data-id]');
    media.forEach(function(elem){
        elem.style.cursor='pointer';
        elem.addEventListener('click', showFullInfo);
    });
}

function showFullInfo(){
    let url ='';
    
    if (this.dataset.type==='movie'){
        url='https://api.themoviedb.org/3/movie/'+this.dataset.id+'?api_key=4e61d32c7f8095da04f6550d8cc3dd94&language=ru';
    } else if (this.dataset.type='tv'){
        url='https://api.themoviedb.org/3/tv/'+this.dataset.id+'?api_key=4e61d32c7f8095da04f6550d8cc3dd94&language=ru';
    } else{
        movie.innerHTML=`<h2 class="col-12 text-center text-danger">Произошла ошибка, повторите позже</h2>`;
    }    ;
    
    fetch(url)
        .then(function(response){
            if (response.status!==200){
                return Promise.reject(new Error(response.status));
            }
            return response.json();
            
        })
        .then((output)=>{
            
            let genres='';
            output.genres.forEach(function(item){
                genres+=item.name+" ";
            });

            movie.innerHTML=`
            <h4 class="col-12 text-center text-info">${output.name||output.title}</h4>
            <div class="col-4">
                <img src='${urlPoster+output.poster_path}' alt='${output.name||output.title}'>
                ${output.homepage ? `<p class='text-center'><a href="${output.homepage}" target="_blank">Официальная страница</a> </p>`:''}
                ${output.imdb_id ? `<p class='text-center'><a href="https://imdb.com/title/${output.imdb_id}" target="_blank">страница IMDB.com</a> </p>`:''} 
            </div>
            <div class="col-8">
                <p> Рейтинг: ${output.vote_average}</p>
                <p> Статус: ${output.status}</p>
                <p> Премьера: ${output.first_air_date || output.release_date}</p>

                ${(output.last_episode_to_air) ? `<p>${output.number_of_seasons} сезон ${output.last_episode_to_air.episode_number} серий вышло </p>`:''}
                <div>Жанры: ${genres}</div>
                <br>
                <div class='youtube'></div>
            </div> 
             `;
            // console.log(this.dataset.type);
            getVideo(this.dataset.type, this.dataset.id);
        })
        .catch(function(e){
            movie.innerHTML="Что-то пошло не так при отображении деталей";
            // console.log(this);
            console.error(e||e.status);
        });
}

document.addEventListener('DOMContentLoaded', function(){
    fetch('http://api.themoviedb.org/3/trending/all/week?api_key=4e61d32c7f8095da04f6550d8cc3dd94&language=ru')
    .then(function(response){
        if ( response.status!== 200){
            return Promise.reject(new Error(response.status));
        }
        return response.json();
    })
    .then(function(output){
       let inner='<h4 class="col-12 text-center text-info">Популярные за неделю!</h4>';
       if (!output.results.length===0){
            inner='<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h2>';
       };
   
    
        output.results.forEach(function (item){
            let nameItem = item.name || item.title;
            let dateItem =  '  ('+(item.first_air_date||item.release_date)+')';
            let mediaType =item.title?'movie':'tv';

            if (item.poster_path && checkURL(item.poster_path)){
                imageItem =urlPoster+item.poster_path;
            }
            else {
                imageItem ='https://dummyimage.com/500x750/99cccc.gif&text=Image+is+not+found!';
            };
            let dataInfo='';
            if (item.media_type!=='person'){
                 dataInfo =`data-id="${item.id}" data-type="${mediaType}"`;
            };
            inner += `
                <div class="col-12 col-md-4 col-xl-3 item">
                    <img src=${imageItem} class='img_poster' alt="${nameItem}" ${dataInfo}>
                    <h5>${nameItem}</h5>
                    <div>${dateItem}</div>
                </div>`;
        });
        movie.innerHTML = inner;  
        // let dataInfo='';
        // const media = movie.querySelectorAll('img[data-id]');
        // media.forEach(function(elem){
        //     elem.style.cursor='pointer';
        //     elem.addEventMedia();
        // });
        addEventMedia();
    })
    .catch(function(error){
        movie.innerHTML='Упс, что-то пошло не так';
        console.error(error);
    });
});

function getVideo(type,id){
    
    let youtube = movie.querySelector('.youtube');
    fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=4e61d32c7f8095da04f6550d8cc3dd94&language=ru`)
        .then((response)=>{
            if (response.status!==200){
                Promise.reject(new Error(response.status));
                return;
            }
            return response.json();
            // console.log(response);
        })
        .then((output)=> {
            let videoFrame=`<h5 class="text-info">Трейлеры</h5>`;
            if (output.results.length===0){
                videoFrame=`<p>К сожалению, видео отсутствует</p>`;
            }
            output.results.forEach((item)=>{
               
                videoFrame+='<iframe width="560" height="315" src="https://www.youtube.com/embed/'+item.key+'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
                console.log(videoFrame);
            });
            youtube.innerHTML = videoFrame;
        })
        .catch((reason)=>{
            youtube.innerHTML='Видео отсутствует';
            console.error(reason||reason.status);

        });
    

};