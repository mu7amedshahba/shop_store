import { useContext, useEffect, useState } from "react";
import { Axios } from "../../../assets/Auth/Axios";
import { MAIN_URL, roleMap, USERS } from "../../../assets/Auth/authPaths";
import { BoardData } from "../contextContent/BoardContext";
import TableContent from "./../../UI/ReUsable/TableContent";

const UsersData = () => {
  const headers = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "role", header: "Role" },
    { key: "action", header: "Action" },
  ];
// 
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pageCount, , setPageCounter] = useState(1);
  const [itemPerPage, , setItemPerPage] = useState(8);
  //
  // 
  const boardContext = useContext(BoardData);
  //
  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const res = await Axios.get(`${MAIN_URL}/${USERS}`);
        setUsersData(res.data.data);
        const role = roleMap[res.data.data.role];
        boardContext.setBoard((prev) => ({
          ...prev,
          userRole: role,
          userCount: res.data.length,
        }));
      } catch (error) {
        setError(error.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  //
  return (
    <div className="">
      <TableContent
        usersData={usersData}
        headers={headers}
        loading={loading}
        errorMessage={error}
        pageCount={pageCount}
        setPageCounter={setPageCounter}
        itemPerPage={itemPerPage}
        setItemPerPage={setItemPerPage}
      />
    </div>
  );
};

export default UsersData;
