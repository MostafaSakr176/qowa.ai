import api from "@/lib/axiosClient";


export async function getEmployees (){
    const res = await api.get("https://api.qowa.ai/employee/employees");
    console.log(res);
    
    return res
}