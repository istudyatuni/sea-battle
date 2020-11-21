# Sea battle web application

*Web*

To start client you need installed npm

Run:
```bash
cd web
npm i
npm start
```

*Server*

To start elixir server, you need installed Elixir

After it, install dependencies:
```
mix deps.get
```

Then run server:

1. `iex -S mix` (it's better for development)

or

2. `mix run --no-halt`

By default in development client starting on `3000` port, and server on `4000`

## How to play in this

Translations: [ru](HowToPlayRU.md)

The player running the application on their PC and the second player must be on the same network. First player must know his IP address on this network, and the second player must connect to `http://address:3000` through browser

For example, if IP address `192.168.40.250` you will connect to `http://192.168.40.250:3000`

**How to know IP address**

In Linux you can find it using `ip a`, in Windows by running `ipconfig` from command line

- Run command line in Windows: press `Win+R`, then type `cmd` and hit `enter`

**Playing**

1. First player set ships, and press "Go battle"
1. Second player set ships, write ID from 1 player, and press "Go battle"
1. You can play!

---

### Small conventions

- The player who placed the ships first makes the first move
- Time for one move is 3 minutes
