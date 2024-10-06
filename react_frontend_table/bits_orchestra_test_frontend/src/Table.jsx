import React, { useEffect, useState } from 'react';
import { parse } from 'papaparse';

function Table() {
  const [records, setRecords] = useState([]);
  const [file, setFile] = useState(null);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const filteredRecords = records.filter((item) => {
    return Object.values(item).some((value) => 
      value && value.toString().toLowerCase().includes(search.toLowerCase())
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const resultRecords = filteredRecords.slice(firstIndex, lastIndex);
  const amountOfPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const numbers = [...Array(amountOfPages + 1).keys()].slice(1);
  function nextPage(){
    if(currentPage !== amountOfPages){
      setCurrentPage(currentPage +1);
    }

  }
  function prePage(){
    if(currentPage !== 1){
      setCurrentPage(currentPage - 1);
    }
  }
  function changeCurrentPage(id)
  {
    setCurrentPage(id)
  }

  const [sorting, setSorting] = useState({ field: 'name', ascending: false })
  function applySorting(key) {
    setSorting((prevState) => ({
      key,
      ascending: prevState.key === key ? !prevState.ascending : true, 
    }));
  }

  useEffect(() => {
    if (sorting.key) {
      const sortedRecords = [...records].sort((a, b) => {
        if (a[sorting.key] === null || b[sorting.key] === null) return 0;
        return a[sorting.key].toString().localeCompare(b[sorting.key].toString(), undefined, { numeric: true });
      });

      setRecords(sorting.ascending ? sortedRecords : sortedRecords.reverse());
    }
  }, [sorting]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch('https://localhost:7021/test/Employee');
      const json = await result.json();
      setRecords(json);
    };
    fetchData();
  }, []);
  
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://localhost:7021/test/Employee/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Record deleted successfully!');
        setRecords(records.filter((record) => record.id !== id));
      } else {
        alert('Failed to delete record.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while deleting the record.');
    }
  };
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  
  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }
    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      const csv = target.result;
  
      const { data, errors } = parse(csv, {
        header: true,
        skipEmptyLines: true,
        transformHeader: header => header.trim() 
      });
  
      const json = data.map((row, index) => {
        const name = row.name ? row.name.trim() : 'Default Name';
    
        const birthDate = row.birthDate 
            ? new Date(row.birthDate).toISOString().split('T')[0] 
            : new Date().toISOString().split('T')[0];
    
        const isMarried = row.isMarried ? row.isMarried.toLowerCase() === 'true' : false;
    
        const phoneNumber = row.phoneNumber ? row.phoneNumber.trim() : '0000000000';
    
        const salary = row.salary && !isNaN(parseFloat(row.salary)) 
            ? parseFloat(row.salary) 
            : null;
    
        const result = { name, birthDate, isMarried, phoneNumber, salary };
        return result;
    });
      try {
        const response = await fetch('https://localhost:7021/test/Employee', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(json),
        });
  
        if (response.ok) {
          alert('Data uploaded successfully!');
          // Refresh the table data
          const result = await fetch('https://localhost:7021/test/Employee');
          const updatedJson = await result.json();
          setRecords(updatedJson);
        } else {
          alert('Failed to upload data.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while uploading the data.');
      }
    };
    reader.readAsText(file);
  };
  const handleEdit = (record) => {
    setEditingId(record.id);
    setEditForm(record);
  };
  const handleSave = async () => {
    try {
      const { id, ...updateData } = editForm;
      console.log(JSON.stringify(editForm))
      const response = await fetch(`https://localhost:7021/test/Employee/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        alert('Record updated successfully!');
        setRecords(records.map((record) => 
          record.id === editingId ? editForm : record
        ));
        setEditingId(null);
      } else {
        alert('Failed to update record.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the record.');
    }
  };
  const handleChange = (e, field) => {
    setEditForm({
      ...editForm,
      [field]: e.target.value,
    });
  };

  return (
    <>
      <div className="my-5 mx-5 flex items-center space-x-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        <button
          onClick={handleUpload}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Upload CSV
        </button>
      </div>
      <input onChange={(e) => setSearch(e.target.value)} placeholder="Filter" type="text" id="default-input" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
      <div className="relative overflow-x-auto mt-5">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3" onClick={() => applySorting('id', !sorting.ascending)}>Id</th>
              <th scope="col" className="px-6 py-3" onClick={() => applySorting('name', !sorting.ascending)}>Name</th>
              <th scope="col" className="px-6 py-3" onClick={() => applySorting('birthDate', !sorting.ascending)}>Birth Date</th>
              <th scope="col" className="px-6 py-3" onClick={() => applySorting('isMarried', !sorting.ascending)}>Married</th>
              <th scope="col" className="px-6 py-3">Phone Number</th>
              <th scope="col" className="px-6 py-3" onClick={() => applySorting('salary', !sorting.ascending)}>Salary</th>
            </tr>
          </thead>
          <tbody>
            {resultRecords.map((record) => (
              <tr key={record.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4">{record.id}</td>
                <td className="px-6 py-4">
                  {editingId === record.id ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => handleChange(e, 'name')}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                  ) : (
                    record.name
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === record.id ? (
                    <input
                      type="date"
                      value={editForm.birthDate}
                      onChange={(e) => handleChange(e, 'birthDate')}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                  ) : (
                    record.birthDate
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === record.id ? (
                    <select
                      value={editForm.isMarried}
                      onChange={(e) => handleChange(e, 'isMarried')}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                      <option value={true}>Yes</option>
                      <option value={false}>No</option>
                    </select>
                  ) : (
                    record.isMarried ? "Yes" : "No"
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === record.id ? (
                    <input
                      type="tel"
                      value={editForm.phoneNumber}
                      onChange={(e) => handleChange(e, 'phoneNumber')}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                  ) : (
                    record.phoneNumber
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === record.id ? (
                    <input
                      type="number"
                      value={editForm.salary}
                      onChange={(e) => handleChange(e, 'salary')}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                  ) : (
                    record.salary
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === record.id ? (
                    <button
                      onClick={handleSave}
                      className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(record)}
                      className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <nav className='my-5 mx-5'>
          <ul className='inline-flex -space-x-px text-sm'>
            <li>
              <a href='#' className='flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white' onClick={prePage}>Prev</a>
            </li>
            {
              numbers.map((n, i) => (
                <li className={`${currentPage === n ? 'active' : ''}`} key={i}>
                  <a href='#' className='flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white' onClick={() => changeCurrentPage(n)}>{n}</a>
                </li>
              ))
            }
            <li>
              <a href='#' className='flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white' onClick={nextPage}>Next</a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Table;