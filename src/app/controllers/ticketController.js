const Moive = require("../models/Moive");
const ShowTime = require("../models/ShowTime");
const Bluebird = require("bluebird");
const Ticket = require("../models/Ticket");
const Room = require("../models/Room");
const User = require("../models/User");
const Combo = require("../models/Combo");
const QRCode = require('qrcode');
const sendEmail = require("../../config/email/sendEmail");
const Discount = require("../models/Discount");
const Bill = require("../models/Bill");
const DetailCombo = require("../models/DetailCombo");
const DetailTicket = require("../models/DetailTicket");

const getAlllTicketQuery = async(query)=>{

 //  0 = chưa xác nhận, 1 === xác nhận, 2=Chờ hủy, 3  === đã hủy   
  if(query ==="0"){
  
  
   
  return await Bill.find({ status: false, cancel:false }).lean().then(async(data)=>{

    const details = await Bluebird.map(data, async(item)=>{

      const isTicket = await Ticket.findById(item.ticket).lean()
          console.log(isTicket.status)
          if(isTicket.status !== true)
      // console.log("bill", item)
        return {
          _id: item._id,
          updatedAt: item.updatedAt,
          ticket: await Ticket.findById(item.ticket).lean().then(async(item)=>{
            const ticket = `
            \nid: ${item._id},
            \nThông tin người mua: ${await User.findById(item.user).lean().then((data)=>{
              return   `\n\temail: ${data.email}, \n\tTên TK: ${data.username}, \n\tTên KH: ${data.fullName}  , \n\tSDT: ${data.phoneNumber}`;} 
            )},
            \nLịch chiếu:  ${await ShowTime.findById(item.time)
              .lean()
              .then(async (data) => {
                return `
                  \n\tThời gian: ${data.time},
                  \n\tPhim: ${await Moive.findById(data.moive).lean().then((data)=>{
                    return `  ${data.name}`
                  })},
                  \n\tPhòng: ${ await Room.findById(data.room).lean().then((data)=>{
                    return `  ${data.name}`
                  })}
                `;
              })} ,
            \nRạp phim: CSV
          `
          let qr = await QRCode.toDataURL(`${ticket}`)                              
            return {
                tiketID: item._id,
                showTime: await ShowTime.findById(item.time)
                  .lean()
                  .then(async (data) => {
                    return {
                      time: data.time,
                      status: data.status,
                      moive: await Moive.findById(data.moive).lean().then((data)=>{
                        return {_id:data._id, name: data.name, images: data.images, ages:data.ages}
                      }),
                      room: await Room.findById(data.room).lean(),
                     
                    };
                  }),
                user: await User.findById(item.user).lean().then((data)=>{
                    return {_id:data._id, username: data.username, email: data.email, fullName: data.fullName,phoneNumber: data.phoneNumber}
                  }),
                number: item.number,
             
                cancel: item.cancel,
                status: item.status,                     
                maQR:  qr,
                vote: item.vote
               
              };
          }),
          price: item.price,
          payment: item.payment ?? null,
          discount: await Discount.findById(item.discount).lean(),
          combo : await DetailCombo.find({bill: item._id}).lean().then(async(detail)=>{
            console.log("detail", detail)
            const combos=  await Bluebird.map(detail, (async(item1)=>{
                const combo = await Combo.findById(item1.combo).lean()
                return{
                  value: item1.quantity,
                  id: combo._id,
                  name: combo.name
                }
                
             }) ,{concurrency: detail.length})
             return combos

            
          })
      
  }
  if(isTicket.status === true) return false
},{concurrency: data.length})
      return details
     
  })


}


   if(query ==="1"){
    
    
     

     return await Bill.find({ status:true, cancel:false }).lean().then(async(data)=>{

      const details = await Bluebird.map(data, async(item)=>{
        const isTicket = await Ticket.findById(item.ticket).lean()
        console.log(isTicket.status)
        if(isTicket.status !== true)
     
        // console.log("bill", item)
          return {
            _id: item._id,
            updatedAt: item.updatedAt,
            ticket: await Ticket.findById(item.ticket).lean().then(async(item)=>{
              const ticket = `
              \nid: ${item._id},
              \nThông tin người mua: ${await User.findById(item.user).lean().then((data)=>{
                return   `\n\temail: ${data.email}, \n\tTên TK: ${data.username}, \n\tTên KH: ${data.fullName}  , \n\tSDT: ${data.phoneNumber}`;} 
              )},
              \nLịch chiếu:  ${await ShowTime.findById(item.time)
                .lean()
                .then(async (data) => {
                  return `
                    \n\tThời gian: ${data.time},
                    \n\tPhim: ${await Moive.findById(data.moive).lean().then((data)=>{
                      return `  ${data.name}`
                    })},
                    \n\tPhòng: ${ await Room.findById(data.room).lean().then((data)=>{
                      return `  ${data.name}`
                    })}
                  `;
                })} ,
              \nRạp phim: CSV
            `
            let qr = await QRCode.toDataURL(`${ticket}`)                              
              return {
                  tiketID: item._id,
                  showTime: await ShowTime.findById(item.time)
                    .lean()
                    .then(async (data) => {
                      return {
                        time: data.time,
                        status: data.status,
                        moive: await Moive.findById(data.moive).lean().then((data)=>{
                          return {_id:data._id, name: data.name, images: data.images, ages:data.ages}
                        }),
                        room: await Room.findById(data.room).lean(),
                       
                      };
                    }),
                  user: await User.findById(item.user).lean().then((data)=>{
                      return {_id:data._id, username: data.username, email: data.email, fullName: data.fullName,phoneNumber: data.phoneNumber}
                    }),
                  number: item.number,
               
                  cancel: item.cancel,
                  status: item.status,                     
                  maQR:  qr,
                  vote: item.vote
                 
                };
            }),
            price: item.price,
            payment: item.payment ?? null,
            discount: await Discount.findById(item.discount).lean(),
            combo : await DetailCombo.find({bill: item._id}).lean().then(async(detail)=>{
              console.log("detail", detail)
              const combos=  await Bluebird.map(detail, (async(item1)=>{
                  const combo = await Combo.findById(item1.combo).lean()
                  return{
                    value: item1.quantity,
                    id: combo._id,
                    name: combo.name
                  }
                  
               }) ,{concurrency: detail.length})
               return combos
  
              
            })
        
    } 
    if(isTicket.status !== true) return false
  },{concurrency: data.length})
        return details
       
    })
   } 
   if(query ==="2"){
   
    return await Bill.find({ cancel:true }).lean().then(async(data)=>{

      const details = await Bluebird.map(data, async(item)=>{
  
  
        // console.log("bill", item)
        // const isTicket = await Ticket.findById(item.ticket).lean()
        // console.log(isTicket.status)
        // if(isTicket.status !== true)
          return {
            _id: item._id,
            ticket: await Ticket.findById(item.ticket).lean().then(async(item)=>{
              const ticket = `
              \nid: ${item._id},
              \nThông tin người mua: ${await User.findById(item.user).lean().then((data)=>{
                return   `\n\temail: ${data.email}, \n\tTên TK: ${data.username}, \n\tTên KH: ${data.fullName}  , \n\tSDT: ${data.phoneNumber}`;} 
              )},
              \nLịch chiếu:  ${await ShowTime.findById(item.time)
                .lean()
                .then(async (data) => {
                  return `
                    \n\tThời gian: ${data.time},
                    \n\tPhim: ${await Moive.findById(data.moive).lean().then((data)=>{
                      return `  ${data.name}`
                    })},
                    \n\tPhòng: ${ await Room.findById(data.room).lean().then((data)=>{
                      return `  ${data.name}`
                    })}
                  `;
                })} ,
              \nRạp phim: CSV
            `
            let qr = await QRCode.toDataURL(`${ticket}`)                              
              return {
                  tiketID: item._id,
                  showTime: await ShowTime.findById(item.time)
                    .lean()
                    .then(async (data) => {
                      return {
                        time: data.time,
                        status: data.status,
                        moive: await Moive.findById(data.moive).lean().then((data)=>{
                          return {_id:data._id, name: data.name, images: data.images, ages:data.ages}
                        }),
                        room: await Room.findById(data.room).lean(),
                       
                      };
                    }),
                  user: await User.findById(item.user).lean().then((data)=>{
                      return {_id:data._id, username: data.username, email: data.email, fullName: data.fullName,phoneNumber: data.phoneNumber}
                    }),
                  number: item.number,
               
                  cancel: item.cancel,
                  status: item.status,                     
                  maQR:  qr,
                  vote: item.vote
                 
                };
            }),
            updatedAt: item.updatedAt,
            price: item.price,
            payment: item.payment ?? null,
            discount: await Discount.findById(item.discount).lean(),
            combo : await DetailCombo.find({bill: item._id}).lean().then(async(detail)=>{
              console.log("detail", detail)
              const combos=  await Bluebird.map(detail, (async(item1)=>{
                  const combo = await Combo.findById(item1.combo).lean()
                  return{
                    value: item1.quantity,
                    id: combo._id,
                    name: combo.name
                  }
                  
               }) ,{concurrency: detail.length})
               return combos
  
              
            })
        
    }
    // if(isTicket.status === true) return false
  },{concurrency: data.length})
        return details
       
    })
   } 
   if(query ==="3"){
  
  return await Bill.findDeleted({ status: false, cancel:false }).lean().then(async(data)=>{

    const details = await Bluebird.map(data, async(item)=>{


     
      // console.log("bill", item)
      // const isTicket = await Ticket.findById(item.ticket).lean()
      // console.log(isTicket.status)
      // if(isTicket.status !== true)
        return {
          _id: item._id,
          updatedAt:item.updatedAt,
          ticket: await Ticket.findById(item.ticket).lean().then(async(item)=>{
            const ticket = `
            \nid: ${item._id},
            \nThông tin người mua: ${await User.findById(item.user).lean().then((data)=>{
              return   `\n\temail: ${data.email}, \n\tTên TK: ${data.username}, \n\tTên KH: ${data.fullName}  , \n\tSDT: ${data.phoneNumber}`;} 
            )},
            \nLịch chiếu:  ${await ShowTime.findById(item.time)
              .lean()
              .then(async (data) => {
                return `
                  \n\tThời gian: ${data.time},
                  \n\tPhim: ${await Moive.findById(data.moive).lean().then((data)=>{
                    return `  ${data.name}`
                  })},
                  \n\tPhòng: ${ await Room.findById(data.room).lean().then((data)=>{
                    return `  ${data.name}`
                  })}
                `;
              })} ,
            \nRạp phim: CSV
          `
          let qr = await QRCode.toDataURL(`${ticket}`)                              
            return {
                tiketID: item._id,
                showTime: await ShowTime.findById(item.time)
                  .lean()
                  .then(async (data) => {
                    return {
                      time: data.time,
                      status: data.status,
                      moive: await Moive.findById(data.moive).lean().then((data)=>{
                        return {_id:data._id, name: data.name, images: data.images, ages:data.ages}
                      }),
                      room: await Room.findById(data.room).lean(),
                     
                    };
                  }),
                user: await User.findById(item.user).lean().then((data)=>{
                    return {_id:data._id, username: data.username, email: data.email, fullName: data.fullName,phoneNumber: data.phoneNumber}
                  }),
                number: item.number,
             
                cancel: item.cancel,
                status: item.status,                     
                maQR:  qr,
                vote: item.vote
               
              };
          }),
          price: item.price,
          payment: item.payment ?? null,
          discount: await Discount.findById(item.discount).lean(),
          combo : await DetailCombo.find({bill: item._id}).lean().then(async(detail)=>{
            console.log("detail", detail)
            const combos=  await Bluebird.map(detail, (async(item1)=>{
                const combo = await Combo.findById(item1.combo).lean()
                return{
                  value: item1.quantity,
                  id: combo._id,
                  name: combo.name
                }
                
             }) ,{concurrency: detail.length})
             return combos

            
          })
      
  }  
    // if(isTicket.status === true) return false

},{concurrency: data.length})
      return details
     
  })
   } 

   if(query ==="4"){
    return await Bill.find({ cancel:false}).lean().then(async(data)=>{
      {
        const details = await Bluebird.map(data, async(item)=>{ 
          const isTicket = await Ticket.findById(item.ticket).lean()
          console.log(isTicket.status)
          if(isTicket.status === true)
            return {
              _id: item._id,
              updatedAt:item.updatedAt,
              ticket: await Ticket.findById(item.ticket).lean().then(async(item)=>{
                const ticket = `
                \nid: ${item._id},
                \nThông tin người mua: ${await User.findById(item.user).lean().then((data)=>{
                  return   `\n\temail: ${data.email}, \n\tTên TK: ${data.username}, \n\tTên KH: ${data.fullName}  , \n\tSDT: ${data.phoneNumber}`;} 
                )},
                \nLịch chiếu:  ${await ShowTime.findById(item.time)
                  .lean()
                  .then(async (data) => {
                    return `
                      \n\tThời gian: ${data.time},
                      \n\tPhim: ${await Moive.findById(data.moive).lean().then((data)=>{
                        return `  ${data.name}`
                      })},
                      \n\tPhòng: ${ await Room.findById(data.room).lean().then((data)=>{
                        return `  ${data.name}`
                      })}
                    `;
                  })} ,
                \nRạp phim: CSV
              `
              let qr = await QRCode.toDataURL(`${ticket}`)                              
                return {
                    tiketID: item._id,
                    showTime: await ShowTime.findById(item.time)
                      .lean()
                      .then(async (data) => {
                        return {
                          time: data.time,
                          status: data.status,
                          moive: await Moive.findById(data.moive).lean().then((data)=>{
                            return {_id:data._id, name: data.name, images: data.images, ages:data.ages}
                          }),
                          room: await Room.findById(data.room).lean(),
                         
                        };
                      }),
                    user: await User.findById(item.user).lean().then((data)=>{
                        return {_id:data._id, username: data.username, email: data.email, fullName: data.fullName,phoneNumber: data.phoneNumber}
                      }),
                    number: item.number,
                 
                    cancel: item.cancel,
                    status: item.status,                     
                    maQR:  qr,
                    vote: item.vote
                   
                  };
              }),
              price: item.price,
              payment: item.payment ?? null,
              discount: await Discount.findById(item.discount).lean(),
              combo : await DetailCombo.find({bill: item._id}).lean().then(async(detail)=>{
               
                const combos=  await Bluebird.map(detail, (async(item1)=>{
                    const combo = await Combo.findById(item1.combo).lean()
                    return{
                      value: item1.quantity,
                      id: combo._id,
                      name: combo.name
                    }
                    
                 }) ,{concurrency: detail.length})
                 return combos
    
                
              })
          
      } 
      else if(isTicket.status !== true)
       return false
    },{concurrency: data.length})
          return details
      }
      
      
       
    })
     } 
   
   
  
   
}

const ticket = async(ticketID)=>{
   const data = await Ticket.findById(ticketID).lean().then(async(ticket)=>{
    
    return {        
        showTime: await ShowTime.findById(ticket.time)
          .lean()
          .then(async (data) => {
            return {
              time: data.time,
              moive: await Moive.findById(data.moive).lean().then((data)=>{
                return {name: data.name, images: data.images, ages:data.ages}
              }),
              room: await Room.findById(data.room).lean(),
            };
          }),
        user: await User.findById(ticket.user).lean().then((data)=>{
            return {username: data.username, email: data.email, fullName: data.fullName,phoneNumber: data.phoneNumber}
          }),
         discount: await Discount.findById(ticket.discount).lean(),
        number: ticket.number,
        price: ticket.price,
        payment: ticket.payment ?? null,
        combo: ticket.combo ?? null,
        cancel: item.cancel,
        status: item.status,
      };
   })
 
   return data
 
}
const timeNow = new Date();

const ticketController = {
  createTicket: async (req, res) => {
    try {
      
      const timeNow = new Date()
      const infoTicket = req.body;
      let {user,time,number,price,payment,paymentId,combo,discount,veChon}  = req.body
     
      console.log(infoTicket)
      const showtime = await ShowTime.findById(infoTicket.time).lean()
      const timeShow = new Date(showtime.time)
      if(timeNow.getTime() >  timeShow.getTime() + 1800000) return res.status(404).json({ error: error });
      // console.log(infoTicket);
      const IsBill = await Bill.findOne({paymentId: infoTicket.paymentId});
      

      console.log("veChon:" ,veChon)
      console.log(IsBill)

      if(!IsBill && discount  !== ""){
      const newTicket = new Ticket({
        user:infoTicket.user, 
        time: time,
        number: number,
        price:price, 
      
      });
       await newTicket.save().then(async(data)=>{
        veChon.map(async(item)=>{
          const detailTicket = new DetailTicket({
            ticket: data._id,
            price: item.price,
            priceTicket: item.id,
            name: item.name,
          })
          detailTicket.save()
        })
       const newBill = new Bill({
          ticket: data._id,
          user: infoTicket.user,
          price: price,
          paymentId: paymentId,
          payment: payment,        
          discount: infoTicket.discount

       })

        newBill.save().then(async(data1)=>{
          console.log(data1)
          
          const isCombo = await infoTicket.combo.filter(item=>{
            if(item.id ===""  || item.value ===0)return false;
             else return true;
            
          })
          if(isCombo.length > 0){
            infoTicket.combo.map(async(item)=>{
              const newDetailCombo = new DetailCombo({
                combo: item.id,
                bill: data1._id,
                quantity: item.value
  
              })
              newDetailCombo.save().then(async(data2)=>{
                console.log(data2)
              })

            })
          }
        })
       
       
          const discount = await Discount.findById(data.discount).lean()
          if(discount){await Discount.findByIdAndUpdate(data.discount,{
            $set:{
              quanity: discount.quanity -1 
            }
          })}
       
      
        console.log(data);
        const user = await User.findById(data.user).lean()
        const link ="Cảm ơn bạn đã mua vé thành CSV, chi tiết vé vui lòng xem trong mục: Vé của bạn"
        console.log(link)
        await sendEmail(user.email, "Mua vé thành công", link);
        res.status(200).json({ success: true});
      })
      
     
      }
      else if(IsBill){
      
     return   res.status(200).json({success: false})
    }
      else if(!IsBill && discount === ""){
     
        const newTicket = new Ticket({
          user:infoTicket.user, 
          time: time,
          number: number,
          price:price, 
         
          discount:null
        });
         await newTicket.save().then(async(data)=>{
          veChon.map(async(item)=>{
            const detailTicket = new DetailTicket({
              ticket: data._id,
              price: item.price,
              priceTicket: item.id,
              name: item.name,
            })
            detailTicket.save()
          })
         const newBill = new Bill({
            ticket: data._id,
            user: infoTicket.user,
            price: price,
            paymentId: paymentId,
            payment: payment,
          
            discount: null
         })
          newBill.save().then(async(data1)=>{
            console.log(data1)
            const isCombo = await infoTicket.combo.filter(item=>{
              if(item.id ===""  || item.value ===0)return false;
              else return true;
            })
            console.log("isCombo: " + isCombo)
            if(isCombo.length > 0){
              infoTicket.combo.map(async(item)=>{
                const newDetailCombo = new DetailCombo({
                  combo: item.id,
                  bill: data1._id,
                  quantity: item.value
    
                })
                newDetailCombo.save().then(async(data2)=>{
                  console.log(data2)
                })
  
              })
            }
          })
          console.log(data);
          const user = await User.findById(data.user).lean()
          const link ="Cảm ơn bạn đã mua vé thành CSV, chi tiết vé vui lòng xem trong mục: Vé của bạn"
          console.log(link)
          await sendEmail(user.email, "Mua vé thành công", link);
          res.status(200).json({ success: true});
        })
        
       
        
       
        
     }
      
    } catch (error) {
      console.log(error)
      return   res.status(404).json({ error: error });
    }
  },
  getAllTicketUserID: async (req, res) => {
    console.log(req.params.userID);
    try {
     
      const userID = req.params.userID;
      
       
       await Bill.find({user :userID}).lean().then(async(data)=>{

        const details = await Bluebird.map(data, async(item)=>{


          console.log("bill", item)
            return {
              status: item.status,
              cancel: item.cancel,
              created: item.createdAt,
              _id: item._id,
              ticket: await Ticket.findById(item.ticket).lean().then(async(item)=>{
                const ticket = `
                \nid: ${item._id},
                \nThông tin người mua: ${await User.findById(item.user).lean().then((data)=>{
                  return   `\n\temail: ${data.email}, \n\tTên TK: ${data.username}, \n\tTên KH: ${data.fullName}  , \n\tSDT: ${data.phoneNumber}`;} 
                )},
                \nLịch chiếu:  ${await ShowTime.findById(item.time)
                  .lean()
                  .then(async (data) => {
                    return `
                      \n\tThời gian: ${data.time},
                      \n\tPhim: ${await Moive.findById(data.moive).lean().then((data)=>{
                        return `  ${data.name}`
                      })},
                      \n\tPhòng: ${ await Room.findById(data.room).lean().then((data)=>{
                        return `  ${data.name}`
                      })}
                    `;
                  })} ,
                \nRạp phim: CSV
              `
              let qr = await QRCode.toDataURL(`${ticket}`)                              
                return {
                    tiketID: item._id,
                    showTime: await ShowTime.findById(item.time)
                      .lean()
                      .then(async (data) => {
                        return {
                          time: data.time,
                          status: data.status,
                          moive: await Moive.findById(data.moive).lean().then((data)=>{
                            return {_id:data._id, name: data.name, images: data.images, ages:data.ages}
                          }),
                          room: await Room.findById(data.room).lean(),
                         
                        };
                      }),
                    user: await User.findById(item.user).lean().then((data)=>{
                        return {_id:data._id, username: data.username, email: data.email, fullName: data.fullName,phoneNumber: data.phoneNumber}
                      }),
                    number: item.number,
                 
                    cancel: item.cancel,
                    status: item.status,                     
                    maQR:  qr,
                    vote: item.vote
                   
                  };
              }),
              price: item.price,
              payment: item.payment ?? null,
              discount: await Discount.findById(item.discount).lean(),
              combo : await DetailCombo.find({bill: item._id}).lean().then(async(detail)=>{
                console.log("detail", detail)
                const combos=  await Bluebird.map(detail, (async(item1)=>{
                    const combo = await Combo.findById(item1.combo).lean()
                    return{
                      value: item1.quantity,
                      id: combo._id,
                      name: combo.name
                    }
                    
                 }) ,{concurrency: detail.length})
                 return combos

                
              })
          
      } },{concurrency: data.length})
          return details
         
      }).then((data)=>{
        res.status(200).json(data)
      }).catch((err)=>{
        console.log(err)
      })
      
      
    } catch (error) {
      console.log(error)
      res.status(404).json({ error: error });
    }
  },
 getTicketID:  async(req,res)=>{
  try {
    const billID = req.params.tiketID;
      
     await Bill.find({ticket :billID}).lean().then(async(data)=>{

        const details = await Bluebird.map(data, async(item)=>{


          console.log("bill", item)
            return {
              ticket: await Ticket.findById(item.ticket).lean().then(async(item)=>{
                const ticket = `
                \nid: ${item._id},
                \nThông tin người mua: ${await User.findById(item.user).lean().then((data)=>{
                  return   `\n\temail: ${data.email}, \n\tTên TK: ${data.username}, \n\tTên KH: ${data.fullName}  , \n\tSDT: ${data.phoneNumber}`;} 
                )},
                \nLịch chiếu:  ${await ShowTime.findById(item.time)
                  .lean()
                  .then(async (data) => {
                    return `
                      \n\tThời gian: ${data.time},
                      \n\tPhim: ${await Moive.findById(data.moive).lean().then((data)=>{
                        return `  ${data.name}`
                      })},
                      \n\tPhòng: ${ await Room.findById(data.room).lean().then((data)=>{
                        return `  ${data.name}`
                      })}
                    `;
                  })} ,
                \nRạp phim: CSV
              `
              let qr = await QRCode.toDataURL(`${ticket}`)                              
                return {
                    tiketID: item._id,
                    showTime: await ShowTime.findById(item.time)
                      .lean()
                      .then(async (data) => {
                        return {
                          time: data.time,
                          status: data.status,
                          moive: await Moive.findById(data.moive).lean().then((data)=>{
                            return {_id:data._id, name: data.name, images: data.images, ages:data.ages}
                          }),
                          room: await Room.findById(data.room).lean(),
                         
                        };
                      }),
                    user: await User.findById(item.user).lean().then((data)=>{
                        return {_id:data._id, username: data.username, email: data.email, fullName: data.fullName,phoneNumber: data.phoneNumber}
                      }),
                    number: item.number,
                 
                    cancel: item.cancel,
                    status: item.status,                     
                    maQR:  qr,
                    vote: item.vote
                   
                  };
              }),
              price: item.price,
              payment: item.payment ?? null,
              discount: await Discount.findById(item.discount).lean(),
              combo : item.combo ? await DetailCombo.find({bill: item._id}).lean().then(async(detail)=>{
                console.log("detail", detail)
                const combos=  await Bluebird.map(detail, (async(item1)=>{
                    const combo = await Combo.findById(item1.combo).lean()
                    return{
                      value: item1.quantity,
                      id: combo._id,
                      name: combo.name
                    }
                    
                 }) ,{concurrency: detail.length})
                 return combos

                
              }): null
          
      } },{concurrency: data.length})
          return details
         
      }).then((data)=>{
        res.status(200).json(data)
      }).catch((err)=>{
        console.log(err)
      })


    // res.status(200).json({ticket: ticket,id : tiketID});
  } catch (error) {
    res.status(404).json({ error: error });
  }
 },

 getAlllTicket:  async(req,res)=>{
  try {
    
    const query = req.params.query
    
    let bills =await getAlllTicketQuery(query) 
    bills= bills.filter(Boolean)
    console.log(bills)
    res.status(200).json({bills: bills});
  } catch (error) {
    res.status(404).json({ error: error });
  }
 },

 

/// xác nhận đặt vé 

accuracyTicket:  async(req,res)=>{
  try {
 
    const _id = req.params.query
    const bill = await Bill.findById(_id).lean()
    if(bill) {
     await Bill.findByIdAndUpdate(_id,{
        $set:{
          status: true,
        }
      }).then(async(data)=>{
        const user = await User.findById(data.user).lean()
        const link ="CSV đã các nhận bạn mua vé, chi tiết vé vui lòng xem trong mục: Vé của bạn"
        console.log(link)
        await sendEmail(user.email, "Xác nhận mua vé thành công", link);
      })
    return  res.status(200).json({success: true});
    }     
  return  res.status(404).json({ error: error });
  } catch (error) {
   return res.status(404).json({ error: error });
  }
 },


 // Yêu cầu hủy vé.
 cancelTicket:  async(req,res)=>{
  console.log(req.params.query)
  try {
   
    const _id = req.params.query
    const ticket = await Bill.findById(_id).lean().then(async data =>{
      //console.log(data)
      return await Ticket.findById(data.ticket).lean()
    })
   // console.log(ticket)
    const showTime = await ShowTime.findById(ticket.time);
    const time = new Date(showTime.time)
    console.log(time)
    if(timeNow.getTime() + 43200000 > time.getTime()){
      return res.status(200).json({success:false, message:"Không thể hủy vé trước 12h kể từ thời điểm hiện tại tới thời gian bắt đầu chiếu!"});
    }
    if(ticket) {
    await  Bill.findByIdAndUpdate(_id,{
        $set:{
          cancel: true,
        }
      })
     return res.status(200).json({success: true});
    }     
   return res.status(404).json({ error: error });
  } catch (error) {
    res.status(404).json({ error: error });
  }
 },

 // Hủy vé 
 deleteTicket:  async(req,res)=>{
  try {
 
    const _id = req.params.query
    const bill = await Bill.findById(_id).lean()
    if(bill) {
     await Bill.delete(_id).then(async(data)=>{
      const user = await User.findById(data.user).lean()
        const link ="Hủy vé thành công, cảm ơn bạn!"
        console.log(link)
        await sendEmail(user.email, "Xác nhận hủy vé thành công", link);
     })
     
      res.status(200).json({success: true});
    }     
    res.status(404).json({ error: error });
  } catch (error) {
    res.status(404).json({ error: error });
  }
 }


  
};

module.exports = ticketController;
