import { Hono } from 'hono';

const app = new Hono();

let nextId = 3;
const users = [
  { id: 1, name: 'Neba', email: 'neba@gmail.com', password: 'ne10101' },
  { id: 2, name: 'Babi', email: 'babi@gmail.com', password: 'babi12345' },
];

app.get('/users', (c) => c.json(users));

app.get('/users/:id', (c) => {
  const id = parseInt(c.req.param('id'));
  const user = users.find(u => u.id === id);
  return user ? c.json(user) : c.json({ error: 'Not found' }, 404);
});

app.post('/signup', async (c) => {
  const body = await c.req.json() as any;
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return c.json({ error: 'Missing fields' }, 400);
  }

  if (users.some(u => u.email === email)) {
    return c.json({ error: 'Email taken' }, 409);
  }

  const newUser = { id: nextId++, name, email, password };
  users.push(newUser);
  return c.json({ id: newUser.id, name, email }, 201);
});

app.post('/signin', async (c) => {
  const { email, password } = await c.req.json() as any;

  if (!email || !password) {
    return c.json({ error: 'Missing email or password' }, 400);
  }

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  return c.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
});

<<<<<<< HEAD
export default app;
=======
export default app;
>>>>>>> cd78337 (Skeleton)
