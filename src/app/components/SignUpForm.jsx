"use client";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faCheckCircle } from '@fortawesome/fontawesome-free-solid'
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { loginUsingEmail, loginOAuthGithub,  getCurrentUser,signupUsingEmail, isLoggedIn } from '@/app/lib/appwriteUtilities';
import {useState, useLayoutEffect} from "react"
import { useRouter } from 'next/navigation';
config.autoAddCss = false

const SignUpForm = () => {

  const router = useRouter()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false)
  const [name , setName] = useState("")
  const [errorMessage, setErrorMessage]  = useState("")
  const [signUpSuccess , setSignUpSuccess] = useState(false)

  // useLayoutEffect (() => {
  //   console.log("page getting rerendered again")
  //   isLoggedIn().then((status) => {
  //     console.log("status of authentication : ", status)
  //     if(!!status){
  //       router.push("/")
  //     }
  //     //  router.replace("/dashboard")
  //   }).catch((ex) => {
  //     console.log("erroe occured during layout effect",ex)
  //   })

  // })
  

  const handleGithubSignIn = async() => {
    setLoading(true)
    setErrorMessage("")
    setEmail('')
    setPassword('')
    try{
      let signInStatus = loginOAuthGithub()
      if(!!signInStatus) {
        router.push('/')
      }
    }catch(ex) {
      console.log("Error occured during signup through github", ex)
      setErrorMessage(ex)
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterUser = async(email,password) => {
    setErrorMessage("")
    setLoading(true)
    console.log("handling register user")
    console.log("email : " , email)
    console.log("password : ",password)
    try{
      const userInfo = await signupUsingEmail(email,password)
      if(userInfo) {
        setSignUpSuccess(true)
      }
    } catch(ex) {
        console.log("handleRegisterUser error : ",ex)
        setErrorMessage(String(ex.message))
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div>
      <div className="grid gap-6 ">
       <form>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label>
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <Label>
              Password
            </Label>
            <Input
              id="password"
              placeholder="password"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isLoading}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button disabled={isLoading} onClick={()=> handleRegisterUser(email,password)}>
            {isLoading && (
                <FontAwesomeIcon className="mr-5" icon={faSpinner} />
            )}
            Register
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button  type="button" onClick={()=>handleGithubSignIn()} >
        {isLoading ? (
            <FontAwesomeIcon className="mr-5" icon={faSpinner} spin size="2x" />
          ) : (
            <FontAwesomeIcon className="mr-5" icon={faGithub} />
          )}{" "}
          GitHub
      </Button>
      {
        errorMessage!="" && (
          <p className="text-red-500">{errorMessage}</p> 
        )
      }
      {
        signUpSuccess!=false && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
          <p className="font-bold">Signup Successful</p>
          <p>Your accout has been created. Proceed to login</p>
        </div>
        )
      }
      </div>
    </div>
  )
  }
export default SignUpForm;
