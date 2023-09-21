const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "UPDATE"]
  }
});
const port = process.env.PORT || 8080;
const db = require("./models");

io.on('connection', (socket) => {

  socket.on('getSectors', () => {
    db.sequelize.query("SELECT * FROM public.sectors ORDER BY id ASC").then(data => {
      io.emit('sectors', data[0]);
    })
  })

  socket.on('addSector', (data) => {
    db.sequelize.query('INSERT INTO public.sectors (name, "createdAt", "updatedAt", status) VALUES (:name, now(), now(), false)',
        {
          replacements: {
            name: data,
          }
        }).then(() => {
      db.sequelize.query("SELECT * FROM public.sectors ORDER BY id ASC").then(data => {
        io.emit('sectors', data[0]);
      })
    })
  })

  socket.on('deleteAllSectors', () => {
    db.sequelize.query("TRUNCATE TABLE public.sectors RESTART IDENTITY").then(data => {
      io.emit('sectors', data[0]);
    })
  })

  socket.on('changeStatus', name => {
    db.sequelize.query('UPDATE public.sectors SET status = true WHERE name = :name', {replacements: {name: name}}).then(() => {
      db.sequelize.query("SELECT * FROM public.sectors ORDER BY id ASC").then(data => {
        io.emit('sectors', data[0]);
        // console.log('changed')
      })
    });
  })

  socket.on('spinWheel', (data) => {
    io.emit('spin', data);
  })

  socket.on('getDeposit', () => {
    db.sequelize.query("SELECT amount FROM public.deposits").then(data => {
      io.emit('deposit', data[0][0].amount)
    })
  });

  socket.on('updateDeposit', amount => {
    db.sequelize.query("UPDATE public.deposits SET amount = " + amount).then(() => {
      db.sequelize.query("SELECT amount FROM public.deposits").then(data => {
        io.emit('deposit', data[0][0].amount)
      })
    });
  })

  socket.on('updateWidgetName', name => {
    db.sequelize.query('UPDATE public."widgetName" SET name = :name', {replacements: {name: name}}).then(() => {
      db.sequelize.query('SELECT name FROM public."widgetName"').then(data => {
        io.emit('widgetName', data[0][0].name)
      })
    });
  })
  socket.on('getWidgetName', () => {
    db.sequelize.query('SELECT name FROM public."widgetName"').then(data => {
      io.emit('widgetName', data[0][0].name)
    })
  });


  socket.on('getBonuses', () => {
    db.sequelize.query("SELECT * FROM public.bonuses ORDER BY id ASC").then(data => {
      io.emit('bonuses', data[0])
    })
  });

  socket.on('addBonus', (data) => {
    db.sequelize.query('INSERT INTO public.bonuses (name, cost, gave, active, "createdAt", "updatedAt") VALUES (:name, :cost, 0, false, now(), now())',
        {
          replacements: {
            name: data.name,
            cost: data.cost
          }
        }).then(() => {
      db.sequelize.query("SELECT * FROM public.bonuses ORDER BY id ASC").then(data => {
        io.emit('bonuses', data[0])
      })
    })
  })

  socket.on('deleteAllBonuses', () => {
    db.sequelize.query("TRUNCATE TABLE public.bonuses RESTART IDENTITY").then(data => {
      io.emit('bonuses', data[0]);
    })
  })

  socket.on('startBonusesOpening', () => {
    db.sequelize.query('UPDATE public.bonuses SET active = true WHERE id = 1').then(() => {
      db.sequelize.query("SELECT * FROM public.bonuses ORDER BY id ASC").then(data => {
        io.emit('bonuses', data[0])
      })
    });
  })

  socket.on('updateBonus', (data) => {
    db.sequelize.query('UPDATE public.bonuses SET name = :name, cost = :cost, gave = :gave WHERE id = :id', {
      replacements: {
        id: data.id,
        name: data.name,
        cost: data.cost,
        gave: data.gave
      }
    }).then(() => {
      db.sequelize.query("SELECT * FROM public.bonuses ORDER BY id ASC").then(data => {
        io.emit('bonuses', data[0])
      })
    });
  })

  socket.on('openCurrentBonus', (data) => {
    db.sequelize.query("UPDATE public.bonuses SET gave = :gave WHERE id = :id", {
      replacements: {
        gave: data.gave,
        id: data.id
      }
    }).then(() => {
      db.sequelize.query('UPDATE public.bonuses SET active = false WHERE id = :id', {replacements: {id: data.id}}).then(() => {
        db.sequelize.query('UPDATE public.bonuses SET active = true WHERE id = :id', {replacements: {id: data.id + 1}}).then(() => {
          db.sequelize.query("SELECT * FROM public.bonuses ORDER BY id ASC").then(data => {
            io.emit('bonuses', data[0])
          })
        })
      })
    })
  })
});

server.listen(port, function() {
  console.log(`Listening on port ${port}`);
});