const download = require('image-downloader')

const imgArr = [
    "https://dummyimage.com/300x160.jpg/ff4444/ffffff",
    "https://dummyimage.com/1028x928.jpg/cc0000/ffffff",
    "https://dummyimage.com/300x160.jpg/dddddd/000000",
    "https://dummyimage.com/1028x928.jpg/cc0000/ffffff",
    "https://dummyimage.com/300x160.jpg/dddddd/000000",
    "https://dummyimage.com/1028x928.jpg/5fa2dd/ffffff",
    "https://dummyimage.com/300x160.jpg/ff4444/ffffff",
    "https://dummyimage.com/1028x928.jpg/ff4444/ffffff",
    "https://dummyimage.com/300x160.jpg/5fa2dd/ffffff",
    "https://dummyimage.com/1028x928.jpg/ff4444/ffffff",
    "https://dummyimage.com/300x160.jpg/dddddd/000000",
    "https://dummyimage.com/1028x928.jpg/ff4444/ffffff",
    "https://dummyimage.com/300x160.jpg/cc0000/ffffff",
    "https://dummyimage.com/1028x928.jpg/dddddd/000000",
    "https://dummyimage.com/300x160.jpg/5fa2dd/ffffff",
    "https://dummyimage.com/1028x928.jpg/cc0000/ffffff",
    "https://dummyimage.com/300x160.jpg/dddddd/000000",
    "https://dummyimage.com/1028x928.jpg/5fa2dd/ffffff",
    "https://dummyimage.com/300x160.jpg/cc0000/ffffff",
    "https://dummyimage.com/1028x928.jpg/cc0000/ffffff",
    "https://dummyimage.com/300x160.jpg/ff4444/ffffff",
    "https://dummyimage.com/1028x928.jpg/dddddd/000000",
    "https://dummyimage.com/300x160.jpg/dddddd/000000",
    "https://dummyimage.com/1028x928.jpg/ff4444/ffffff",
    "https://dummyimage.com/300x160.jpg/dddddd/000000",
    "https://dummyimage.com/1028x928.jpg/ff4444/ffffff",
    "https://dummyimage.com/300x160.jpg/5fa2dd/ffffff",
    "https://dummyimage.com/1028x928.jpg/5fa2dd/ffffff",
    "https://dummyimage.com/300x160.jpg/cc0000/ffffff",
    "https://dummyimage.com/1028x928.jpg/dddddd/000000"
]

const arr = [
    "Brantley","Tucky","Angelico","Neill","Cameron","Lief","Gan","Woodie","Arie","Ritchie","Hersh","Davey","Kristos","Clerkclaude","Harvey","Joaquin","Mortimer","Sonny","Terri","Norbie","Benton","Colet","Meir","Ashlin","Innis","Bartholomeo","Edgar","Arlan","Randolf","Hoyt"
]
let destSource =''
for (let index = 0; index < imgArr.length-1; index++) {
    if (imgArr[index].includes("300x160")) {
        destSource =  `${__dirname}/public/images/${arr[index]}-300x160.jpg`         
    } else if (imgArr[index].includes("1028x928")) {
        destSource =  `${__dirname}/public/images/${arr[index]}-1028x928.jpg` 
    }
    const options = {
        url: `${imgArr[index]}`,
        dest:     destSource         // will be saved to /path/to/dest/image.jpg
    }
    
    download.image(options)
        .then(({ filename }) => {
            console.log('Saved to', filename)  // saved to /path/to/dest/image.jpg
        })
        .catch((err) => console.error(err)) 
    
}

