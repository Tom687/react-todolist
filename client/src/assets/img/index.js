// TODO : Voir pour faire mieux

/*function importAll(r) {
	return r.keys().map(r);
}

const slides = importAll(require.context('./', false, /\.(png|jpe?g|svg)$/));*/



/*const reqSvgs = require.context ( './', true, /\.(png|jpe?g|svg)$/ )
const paths = reqSvgs.keys ()

const slides = paths.map( path => reqSvgs ( path ) )*/


/*function importAll(r) {
	let images = {};
	r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
	return images;
}

const slides = importAll(require.context('./', false, /\.(png|jpe?g|svg)$/));*/

// id, title, content

// FIXME : Trouver une meilleure solution
const slides = [
	{ 
		id: 1, 
		src: require('./oiseau.jpg'),
		title: 'Un bel oiseau Un bel oiseau encooorreeee',
		content: 'Voici un bel oiseau dans la nature sauvage qu\'il habite sereinement. \n Croyez le ou non, cet oiseau'
		         + ' n\'est pas en voie d\'extinction'
	},
	{ 
		id: 2,
		src: require('./lion.jpg'),
		title: 'Lion français',
		content: 'Ceci est un lion français. C\'est le seul est unique présent sur terre. \n On se demande même comment il'
		         + ' est arrivé là, et comment il a pu venir au monde sans femelle pour l\'accoucher.'
	},
	{
		id: 3,
		src: require('./elephant.jpg'),
		title: 'Elephant dans l\'eau',
		content: 'Voici un éléphant se baignant tranquillement d\'ans l\'eau.'
	},
	{
		id: 4,
		src: require('./elephant-2.jpg'),
		title: 'Un bel oiseau',
		content: 'Voici un bel oiseau dans la nature sauvage qu\'il habite sereinement. \n Croyez le ou non, cet oiseau'
		         + ' n\'est pas en voie d\'extinction'
	},
	{
		id: 5,
		src: require('./oiseau-2.jpg'),
		title: 'Lion français',
		content: 'Ceci est un lion français. C\'est le seul est unique présent sur terre. \n On se demande même comment il'
		         + ' est arrivé là, et comment il a pu venir au monde sans femelle pour l\'accoucher.'
	},
	{
		id: 6,
		src: require('./lion-2.jpg'),
		title: 'Elephant dans l\'eau',
		content: 'Voici un éléphant se baignant tranquillement d\'ans l\'eau.'
	},
];

export default slides;