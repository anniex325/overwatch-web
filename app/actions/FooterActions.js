import alt from '../alt';

class FooterActions {
    constructor() {
	this.generateActions(
	    'getTopCharactersSuccess','getTopCharacterFail'
	);
    }

    getTopCharacters() {
	$.ajax({ url:'/api/characters/top'})
	    .done((data) => {
		this.actions.getTopCharactersSuccess(data)
	    })
	    .fail((jqXhr) => {
		this.actions.getTopcharacterFail(jqXhr)
	    });
    }
}

export default alt.createActions(FooterActions);
