//Student Name: Harish Harish
// Put your Last.fm API key here

var api_key = "";
var artistDetails = new Object;

function initialize()
{
    artistDetails["nameElement"] = document.getElementById("name");
    artistDetails["photoElement"] = document.getElementById("photo");
    artistDetails["lastFmElement"] = document.getElementById("last");
    artistDetails["bioElement"] = document.getElementById("biography");
    artistDetails["topAlbumElement"] = document.getElementById("topAlbum");
    artistDetails["similarArtistsElement"] = document.getElementById("similarArtists");
}

function sendRequest () {
    var xhr = new XMLHttpRequest();
    var method = "artist.getinfo";
    var artist = encodeURI(document.getElementById("form-input").value);
    artistDetails["name"] = document.getElementById("form-input").value;
    xhr.open("GET", "proxy.php?method="+method+"&artist="+artist+"&api_key="+api_key+"&format=json", true);
    xhr.setRequestHeader("Accept","application/json");
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            artistDetails["getInfoResponse"] =  JSON.parse(this.responseText);
            //var json = JSON.parse(this.responseText);
            getTopAlbums();
            // var str = JSON.stringify(json,undefined,2);
            // document.getElementById("output").innerHTML = "<pre>" + str + "</pre>";
        }
    };
    xhr.send(null);
}

function getTopAlbums(){
    var xhr = new XMLHttpRequest();
    var method = "artist.gettopalbums";
    var artist = encodeURI(artistDetails.name);
    xhr.open("GET", "proxy.php?method="+method+"&artist="+artist+"&api_key="+api_key+"&format=json"+"&limit=20", true);
    xhr.setRequestHeader("Accept","application/json");
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            artistDetails["getTopAlbumsResponse"] =  JSON.parse(this.responseText);
            getSimilarArtists();
        }
    };
    xhr.send(null);
}

function getSimilarArtists(){
    var xhr = new XMLHttpRequest();
    var method = "artist.getSimilar";
    var artist = encodeURI(artistDetails.name);
    xhr.open("GET", "proxy.php?method="+method+"&artist="+artist+"&api_key="+api_key+"&format=json"+"&limit=20", true);
    xhr.setRequestHeader("Accept","application/json");
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            artistDetails["getSimilarArtistsResponse"] =  JSON.parse(this.responseText);
            displayBasicInfo();
        }
    };
    xhr.send(null);
}

function displayBasicInfo()
{ 
    document.body.style.backgroundColor = "skyblue";
    artistDetails.nameElement.innerText = artistDetails.getInfoResponse.artist.name;
    
    artistDetails.photoElement.style.position = "Relative";
    artistDetails.photoElement.style.left = "500px";
    artistDetails.photoElement.src = artistDetails.getInfoResponse.artist.image[2]["#text"];

    artistDetails.lastFmElement.text = artistDetails.name;
    artistDetails.lastFmElement.href = artistDetails.getInfoResponse.artist.url;
    
    var biographyInnerHtml = "Biography:" + artistDetails.getInfoResponse.artist.bio.summary;
    artistDetails.bioElement.innerHTML = biographyInnerHtml;
    
    var topAlbumsInnerHtml = "Top Albums: <ul>";
    for(var i=0;i<artistDetails.getTopAlbumsResponse.topalbums.album.length;i++)
    {
        var albums = artistDetails.getTopAlbumsResponse.topalbums.album[i];
        topAlbumsInnerHtml += "<li>" + albums.name + "<p>" +
                                "<img src=" + albums.image[1]["#text"] + "><br>" +
                                "Playcount:" + albums.playcount + "<br>" +
                                "Last.fm link:<a href=" + albums.url + ">" + albums.name +
                                "</a>" + "</p></li>";
    }
    topAlbumsInnerHtml += "</ul>";
    artistDetails.topAlbumElement.innerHTML = topAlbumsInnerHtml;
    
    var similarArtistsInnerHtml = "Similar Artists: <ul>";
    for(var i=0;i<artistDetails.getSimilarArtistsResponse.similarartists.artist.length;i++)
    {
        var artists = artistDetails.getSimilarArtistsResponse.similarartists.artist[i];
        similarArtistsInnerHtml += "<li>" + artists.name + "<p>" +
                                "<img src=" + artists.image[1]["#text"] + "><br>" +
                                "Last.fm link:<a href=" + artists.url + ">" + artists.name +
                                "</a>" + "</p></li>";
    }
    similarArtistsInnerHtml += "</ul>";
    artistDetails.similarArtistsElement.innerHTML = similarArtistsInnerHtml;
}