import React, { useState } from 'react'

function Filter({filter, addFilter, selectedChoices}) {

    const [selected, setSelected] = useState(false);

    const isChoiceChosen = (choiceId) => {
        const choices = [];
        selectedChoices.forEach(filter => {
            filter.choices.forEach(choice => {
                choices.push(choice)
            })
        })

        if (choices.includes(choiceId)) {
            return true;
        }
        
        return false;
    }

    return (
        <div className="filter">
            <p className="filter-title">{filter.title}</p>
            {
            filter.choices.map(choice =>
                <div style={{ 
                    background: isChoiceChosen(choice._id) ? '#3281B9':'white',
                    color: isChoiceChosen(choice._id) ? 'white':'black'
                }}
                    className="choice" 
                    onClick={() => addFilter({filter: filter.title, choice: choice._id})}>
                    <input value={choice._id} checked={isChoiceChosen(choice._id)} type="checkbox"/>
                    <label>{choice.value}</label>
                </div>
                )
            }
      </div>
    )
}

export default Filter
