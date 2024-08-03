import React, { useId } from 'react';
import Select from 'react-select';

const SearchableSelect = ({ options, placeholder, onChange, defaultValue, disabled }) => {
    const [selectedOption, setSelectedOption] = React.useState(null);

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        onChange(selectedOption);
    };
    React.useEffect(() => {
        const defaultOption = options.find(option => option.value === defaultValue);
        setSelectedOption(defaultOption);
    }, [options, defaultValue]);

    return (
        <Select
            instanceId={useId()}
            value={selectedOption}
            onChange={handleChange}
            options={options}
            isSearchable={true}
            placeholder={placeholder}
            isDisabled={ disabled}
     

        />
    );
};

export default SearchableSelect;
