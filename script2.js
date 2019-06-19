const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const urlPoster='https://image.tmdb.org/t/p/w500';
function apiSearch(event){
event.preventDefault();

const searchText = document.querySelector('.form-control').value,
server = 'https://api.themoviedb.org/3/search/multi?api_key=ead41c3eaac089640f31601bd088ab4e&languge=ru&query='+ searchText;
movie.innerHTML='Загрузка...';


fetch(server)
    .then(function(response){
        if ( response.status!== 200){
            return Promise.reject(response);
        }
        return response.json();

    })
    .then(function(output){
        let inner ='';
        let imageItem ='';
        console.log(output);
        output.results.forEach(function (item){
        let nameItem = item.name || item.title;
        let dateItem =  '  ('+(item.first_air_date||item.release_date)+')';

        if (item.poster_path && checkURL(item.poster_path)){
            imageItem =urlPoster+item.poster_path;
        }
        else {
            imageItem ='https://dummyimage.com/500x750/99cccc.gif&text=Image+is+not+found!';
        }
        inner += `
        <div class="col-12 col-md-4 col-xl-3 item">
        <img src=${imageItem}>
        <h5>${nameItem}</h5>
        <div>${dateItem}</div>
        </div>`;
     });
    movie.innerHTML = inner;  
    })
    .catch(function(error){
        movie.innerHTML='Упс, что-то пошло не так';
        console.error(error);
    });
}

searchForm.addEventListener('submit',apiSearch);

function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    
}