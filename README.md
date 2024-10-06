## Bits Orchestra Test task
Create a .NET web application that will allow users to upload CSV file with the field below, store data into MS SQL database, and show stored data on the page.
CSV fields:
- Name [string]
- Date of birth [date]
- Married [bool]
- Phone [string]
- Salary [decimal]<br />
Additionally users should be able to filter data by any column as well as sort by any field on the client side (with javascript).
Also the table should provide inline editing for any row with a possibility to remove a record from the database. Data validation would be a plus.

Technologies Used

Frontend: ReactJS, Tailwind<br />
Backend: .NET 7 <br />
Database: MSSQL

Libraries:
- papaparse for React
- EntityFramework.Tools
