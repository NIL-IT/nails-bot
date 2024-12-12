import AppRoutes from "./components/routes/AppRoutes";
import { Container, Header, Sidebar } from "./components/shared";
import { Button } from "./components/ui";
const data = ["Cкидки", "Дизайны", "Покрытия", "Инструменты"];
function App() {
  return (
    <Container>
      <Header />
      <Sidebar items={data} />
      <AppRoutes />
    </Container>
  );
}

export default App;
