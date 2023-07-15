import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom';
import { variables } from './Variables'
import './Home.css';
import { useGlobalFilter, useSortBy, useTable } from 'react-table';
import { GlobalFilter } from './globalFilter';

function Home() {
  const [jocuri, setJocuri] = useState([])

  const getJocuri = async () => {
    const raspuns = await fetch(
      variables.API_URL + "joc"
    ).then((raspuns) => raspuns.json());

    setJocuri(raspuns);    
  };

  const steamTest =  async () => {
    const raspuns = await fetch(
      "http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=440&count=3&maxlength=300&format=json"
    ).then((steamTest) => steamTest.json());
    console.log(raspuns)
  };

  useEffect(() => {
    steamTest();
    getJocuri();
  }, []);

  const dateJocuri = useMemo(() => [...jocuri], [jocuri]);
  const colJocuri = useMemo(
    () => jocuri[0] ? Object.keys(jocuri[0]).map((key) => {
      return {Header: key, accessor: key}
  }) : [], [jocuri]);

  const tableHooks = (hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        id: "Detalii",
        Header: "",
        Cell: ({ row }) => (
          <Link to = {`/joc/${row.values.JocId}`}>
            Vezi Detalii
          </Link>
        )
      }
    ])
  }

  const tabel = useTable(
    { 
      columns: colJocuri, 
      data: dateJocuri,
      initialState: {hiddenColumns: ['JocId']}  
    }, 
    useGlobalFilter,
    tableHooks,
    useSortBy);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, preGlobalFilteredRows, setGlobalFilter, state } = tabel;


  return (
    <>
    <h1></h1>
      <div className='tw-flex tw-flex-col tw-gap-5 tw-items-center'>
      <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} setGlobalFilter={setGlobalFilter} globalFilter={state.globalFilter} />
          <table className='tw-border-4 tw-border-spacing-0.5 tw-border-separate tw-border-albastru_fundal dark:tw-border-albastru_d' {...getTableProps()}>
            <thead className='tw-bg-albastru_d dark:tw-bg-albastru_i'>
              {headerGroups.map((headerGroup, ) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th className='mic:tw-min-w-[100px] mediu:tw-min-w-[200px] mare:tw-min-w-[250px]'{...column.getHeaderProps(column.getSortByToggleProps())}>
                      { column.render("Header")}
                      {column.isSorted ? (column.isSortedDesc ? " ▼" : " ▲") : " "}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                
                return <tr className='tw-text-center odd:tw-bg-albastru_fundal odd:tw-text-albastru_d even:tw-bg-albastru_i dark:odd:tw-bg-albastru_d dark:even:tw-bg-verde_i dark:even:tw-text-aquamarin dark:odd:tw-text-verde_d' {...row.getRowProps()}>
                  {row.cells.map((cell, idx) => (
                    <td {...cell.getCellProps()}>
                      { cell.render("Cell") }
                    </td>
                  ))}
                </tr>
              })}
            </tbody>
          </table>
      </div>
    </>
  )
}

export default Home