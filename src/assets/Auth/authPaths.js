import Cookies from 'js-cookie';


export const MAIN_URL = "http://127.0.0.1:8000/api";
export const REGISTER = `register`;
export const LOG_IN = `login`;
export const LogOut = `logout`;
// user
export const USERS = `users`;
export const USER = `user`;
export const UPDATE = `update`;
export const Add = `add`;
// 
export const CAT = `categories`;
export const AddCat = `category`;
export const DEL = `category`;
// 
export const PRODS = `/products`;
export const Prod = `product`;
export const latestProd = `latest-sale`;
// google url
export const Google_URL = `auth/google/callback`;

// Roles 

export const roleMap = {
  1995: "Owner",
  1001: "Admin",
  1996: "Moderator",
  2001: "User"
};

export const formInputs = [
  {
    id: 'name',
    name: 'name',
    type: 'text',
    className: 'form-input name-input',
    placeholder: 'Enter your full name',
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: "^[A-Za-z ]+$",
    errorMessage: 'Please enter a valid name (letters only)'
  },
  {
    id: 'email',
    name: 'email',
    type: 'email',
    className: 'form-input email-input',
    placeholder: 'Enter your email',
    required: true,
    pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    errorMessage: 'Please enter a valid email address'
  },
  {
    id: 'password',
    name: 'password',
    type: 'password',
    className: 'form-input password-input',
    placeholder: 'Create a password',
    required: true,
    minLength: 8,
    maxLength: 20,
    pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
    errorMessage: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'
  },
  {
    id: 'confirm_password',
    name: 'confirm_password',
    type: 'password',
    className: 'form-input confirm-password-input',
    placeholder: 'Confirm your password',
    required: true,
    matchWith: 'password',
    errorMessage: 'Passwords do not match'
  },
  {
    id: 'phone_number',
    name: 'phone_number',
    type: 'tel',
    className: 'form-input phone-input',
    placeholder: 'Enter your phone number',
    required: false,
    pattern: "^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$",
    errorMessage: 'Please enter a valid phone number'
  }
];



export const E_SHOP_TOKEN = `e_shop_token`
export const JWT_TOKEN = Cookies.get(E_SHOP_TOKEN)
