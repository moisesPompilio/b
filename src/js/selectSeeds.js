const checkWordListLength = ( position ) => {
    let multiple = Math.abs( position / WORD_LIST.length );
    multiple = Math.floor(multiple);
    if (multiple === 0) {
        multiple = 1;
    }
    const lengthWordList = multiple * WORD_LIST.length;
    if ( position > WORD_LIST.length ) {
        position = position - lengthWordList;
        position = checkWordListLength( position );
    } else if ( position < 1 ) {
        position = position + lengthWordList;
        position = checkWordListLength( position );
    }
    return position;
}

const addIncrement = ( position ) => {
    const operation = parseInt(document.getElementById('increment').value, 0) | 0;

    if( operation === 0 ) {
        return position;
    }

    return checkWordListLength(position + operation);
}

const removeIncrement = ( position ) => {
    const operation = parseInt(document.getElementById('increment').value, 0) | 0;

    if( operation === 0 ) {
        return position;
    }

    return checkWordListLength( position - operation );
}

const searchPositions = (inputValue) => {
    const keywords = inputValue.split(/[ ,]+/);
    const result = [];

    keywords.forEach((keyword) => {
        const index = WORD_LIST.indexOf(keyword);
        if (index !== -1) {
            result.push( addIncrement( index + 1) );
        }
    });

    return result.join(', ');
};

const showWords = (inputValue) => {
    const positions = inputValue.split(/[ ,]+/);
    const result = [];

    positions.forEach((position) => {
        const index = removeIncrement( parseInt(position, 10) ) - 1;
        if (index >= 0 && index < WORD_LIST.length) {
            result.push(WORD_LIST[index]);
        }
    });

    return result.join(' ');
};

const submitSeedsForm = async () => {
    document.getElementById('seedResult').innerHTML = null;

    const operation = document.getElementById('seedOperation').value;
    const seedInput = document.getElementById('seedInput').value;

    let result;
    try {
        if (operation === 'search') {
            result = searchPositions(seedInput);
        } else {
            result = showWords(seedInput, password);
        }
    } catch (error) {
        console.error(error.message);
    }

    document.getElementById('seedResult').innerHTML = `${result}`;
    toggleCopyButton( "seedResult", "seedResultContainer" );
};

document.getElementById('seedsForm').addEventListener('submit', (event) => {
    event.preventDefault();
    submitSeedsForm();
});