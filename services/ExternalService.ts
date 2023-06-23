import { UpdateUserData } from '../types';
import axios from 'axios';


class ExternalService {
    updateProductOwner(data: UpdateUserData) {
        return axios.post(`http://localhost:3000/webhooks/update`, {
            data
        })
    }
}


export default new ExternalService();