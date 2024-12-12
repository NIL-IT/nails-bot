import AppRoutes from "./components/routes/AppRoutes";
import { Container, Header, Sidebar } from "./components/shared";
import { Button } from "./components/ui";

function App() {
  return (
    <Container>
      <Header />
      <Sidebar />
      <AppRoutes />
    </Container>
  );
}

export default App;
