import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
function App() {
  return (
      <div>
        <h1>home page</h1>


      <SignedOut>
        <SignInButton />
      </SignedOut>
      
      <SignedIn>
        <UserButton />
      </SignedIn>
      </div>
  )
}

export default App
