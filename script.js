const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
function apiSearch(event){
event.preventDefault();

const searchText = document.querySelector('.form-control').value,
server = 'http://api.themoviedb.org/3/search/multi?api_key=ead41c3eaac089640f31601bd088ab4e&languge=ru&query='+ searchText;
requestApi('GET', server);
}

searchForm.addEventListener('submit',apiSearch);

function requestApi(method,url){
    const request = new XMLHttpRequest();
    request.open(method, url);
    request.send();
    request.addEventListener('readystatechange', ()=>{
        if (request.readyState !== 4) { return};
        if (request.status !== 200) {
            console.log('error: '+ request.status);
            return;
        }
        const output = JSON.parse(request.responseText);
        let inner ='';
        output.results.forEach(function (item){
            let nameItem = item.name || item.title;
            let dateItem =  '  ('+(item.first_air_date||item.release_date)+')' ;
            console.log(nameItem+ " "+ dateItem);
            inner += `<div class="col-12">${nameItem+dateItem}</div>`;
        });
        movie.innerHTML = inner;
        console.log(output);
    })

}