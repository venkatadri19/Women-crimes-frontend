import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';  // Import Chart.js

const CrimeDashboard = () => {
    const [data, setData] = useState([]);
    const [selectedState, setSelectedState] = useState(null);
    const [chartData, setChartData] = useState({});
    const refd = useRef(null)
    let chartRef = refd; // Reference for the chart

    useEffect(() => {
        // Fetch data from the API
        const fetchData = async () => {
            const response = await axios.get('http://13.210.14.7/api/crimes');
            setData(response.data);
        };
        fetchData();
    }, []);

    const columns = React.useMemo(
        () => [
          {
            Header: 'State',
            accessor: 'State',
        },
        {
            Header: 'Year',
            accessor: 'Year',
        },
        {
            Header: 'No of Rape cases',
            accessor: 'No of Rape cases',
        },
        {
            Header: 'Kidnap And Assault',
            accessor: 'Kidnap And Assault',
        },
        {
            Header: 'Dowry Deaths',
            accessor: 'Dowry Deaths',
        },
        {
            Header: 'Assault Against Women',
            accessor: 'Assault against women',
        },
        {
          Header: 'Assault against modesty of women',
          accessor: 'Assault against modesty of women',
        },
        {
            Header: 'Domestic violence',
            accessor: 'Domestic violence',
        },
        {
            Header: 'Women Trafficking',
            accessor: 'Women Trafficking',
        },
        ],
        []
    );

    const handleRowClick = (row) => {
        
        setSelectedState(row.original.State);
        setChartData({
            labels: ['Rape', 'Kidnapping', 'Dowry Deaths', 'Assault', 'Domestic Violence', 'Trafficking'],
            datasets: [
                {
                    label: `Crime Data for ${row.original.State}`,
                    data: [
                      row.original['No of Rape cases'],
                      row.original['Kidnap And Assault'],
                      row.original['Dowry Deaths'],
                      row.original['Assault against women'],
                      row.original['Assault against modesty of women'],
                      row.original['Domestic violence'],
                      row.original['Women Trafficking'],
                    ],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        });

        // Destroy the previous chart instance if it exists
        
    };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data });

    return (
        <div>
            <h1>Crimes Against Women in India</h1>
            <table {...getTableProps()} style={{ width: '100%', border: '1px solid black' }}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} onClick={() => handleRowClick(row)}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {selectedState && (
                <div>
                    <h2>Crime Data for {selectedState}</h2>
                    <Bar ref={chartRef} data={chartData} options={{ responsive: true }} />
                </div>
            )}
        </div>
    );
};

export default CrimeDashboard;
