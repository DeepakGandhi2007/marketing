import React from 'react';
import Select from 'react-select';

const SearchableSelect = ({ options, placeholder, onChange }) => {
    const [selectedOption, setSelectedOption] = React.useState(null);

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        onChange(selectedOption);
    };

    return (
        <Select
            value={selectedOption}
            onChange={handleChange}
            options={options}
            isSearchable={true}
            placeholder={placeholder}

        />
    );
};

export default SearchableSelect;
