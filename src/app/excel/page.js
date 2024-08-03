const ParsedDataTable = ({ data }) => {
    if (!data || data.length === 0) {
        return <p>No data available.</p>;
    }

    const headers = Object.keys(data[0]);
    return (
        <div className="table-container" style={{ maxHeight: '500px', overflowY: 'scroll' }}>
            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        {data.length > 0 && Object.keys(data[0]).map((header, index) => (
                            <th style={{ position: 'sticky', top: 0, background: '#333', color: '#fff' }} key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {Object.values(row).map((value, colIndex) => (
                                <td key={colIndex}>{value}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ParsedDataTable;
