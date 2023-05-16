const Moive = require("../models/Moive");
const ShowTime = require("../models/ShowTime");
const Bluebird = require("bluebird");
const Ticket = require("../models/Ticket");
const Room = require("../models/Room");
const User = require("../models/User");
const Combo = require("../models/Combo");
const QRCode = require('qrcode');
const sendEmail = require("../../config/email/sendEmail");

const getAlllTicketQuery = async(query)=>{

 //  0 = chưa xác nhận, 1 === xác nhận, 2=Chờ hủy, 3  === đã hủy   
  if(query ==="0"){
   let ticket =  await Ticket.find({ status: false, cancel:false })
     .lean()
     .then(async (data) => {
             const array1 = await Bluebird.map(data, async(item)=>{
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
                 // console.log(qr);
                 
                 return {
                     tiketID: item._id,
                     showTime: await ShowTime.findById(item.time)
                       .lean()
                       .then(async (data) => {
                         return {
                           time: data.time,
                           updatedAt: item.updatedAt,
                           moive: await Moive.findById(data.moive).lean().then((data)=>{
                             return {name: data.name, images: data.images, ages:data.ages}
                           }),
                           room: await Room.findById(data.room).lean(),
                         };
                       }),
                     user: await User.findById(item.user).lean().then((data)=>{
                         return {username: data.username, email: data.email, fullName: data.fullName,phoneNumber: data.phoneNumber}
                       }),
                     number: item.number,
                     price: item.price,
                     payment: item.payment ?? null,
                     cancel: item.cancel,
                     status: item.status,
                   
                     combo:  await Bluebird.map(item.combo, async(item)=>{
                         const combo = await Combo.findById(item.id).lean()
                         console.log( "combo",combo)
                         return{
                           id : combo._id,
                           name: combo.name,
                           value: item.value,
                         }
                     }, { concurrency: item.combo.length}) ?? null,
                     maQR:  qr,
                    
                   };
             }, { concurrency: data.length})
 
       // console.log(array1)
       return array1;
     });  

   ticket.sort((a,b)=>{
    if (a.updatedAt > b.updatedAt) return 1;
    if (a.updatedAt < b.updatedAt) return -1;
   })  
   return ticket
   }
   if(query ==="1"){
    return  await Ticket.find({ status: true, cancel:false })
     .lean()
     .then(async (data) => {
             const array1 = await Bluebird.map(data, async(item)=>{
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
                 // console.log(qr);
                 
                 return {
                     tiketID: item._id,
                     showTime: await ShowTime.findById(item.time)
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
                     user: await User.findById(item.user).lean().then((data)=>{
                         return {username: data.username, email: data.email, fullName: data.fullName,phoneNumber: data.phoneNumber}
                       }),
                     number: item.number,
                     price: item.price,
                     payment: item.payment ?? null,
                     cancel: item.cancel,
                     status: item.status,
                     
                    updatedAt: item.updatedAt,

                   
                     combo:  await Bluebird.map(item.combo, async(item)=>{
                         const combo = await Combo.findById(item.id).lean()
                         console.log( "combo",combo)
                         return{
                           id : combo._id,
                           name: combo.name,
                           value: item.value,
                         }
                     }, { concurrency: item.combo.length}) ?? null,
                     maQR:  qr,
                    
                   };
             }, { concurrency: data.length})
 
       // console.log(array1)
       return array1;
     });  
   } 
   if(query ==="2"){
    let ticket= await Ticket.find({ cancel:true })
     .lean()
     .then(async (data) => {
             const array1 = await Bluebird.map(data, async(item)=>{
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
                 // console.log(qr);
                 
                 return {
                     tiketID: item._id,
                     updatedAt: item.updatedAt,
                     showTime: await ShowTime.findById(item.time)
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
                     user: await User.findById(item.user).lean().then((data)=>{
                         return {username: data.username, email: data.email, fullName: data.fullName,phoneNumber: data.phoneNumber}
                       }),
                     number: item.number,
                     price: item.price,
                     payment: item.payment ?? null,
                     cancel: item.cancel,
                     status: item.status,
                   
                     combo:  await Bluebird.map(item.combo, async(item)=>{
                         const combo = await Combo.findById(item.id).lean()
                         console.log( "combo",combo)
                         return{
                           id : combo._id,
                           name: combo.name,
                           value: item.value,
                         }
                     }, { concurrency: item.combo.length}) ?? null,
                     maQR:  qr,
                    
                   };
             }, { concurrency: data.length})
 
       // console.log(array1)
       return array1;
     }); 
     ticket.sort((a,b)=>{
      if (a.updatedAt > b.updatedAt) return 1;
      if (a.updatedAt < b.updatedAt) return -1;
     })  
     return ticket 
   } 
   if(query ==="3"){
   let ticket=  await Ticket.findDeleted()
     .lean()
     .then(async (data) => {
             const array1 = await Bluebird.map(data, async(item)=>{
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
                 // console.log(qr);
                 
                 return {
                     tiketID: item._id,
                     showTime: await ShowTime.findById(item.time)
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
                     user: await User.findById(item.user).lean().then((data)=>{
                         return {username: data.username, email: data.email, fullName: data.fullName,phoneNumber: data.phoneNumber}
                       }),
                     number: item.number,
                     price: item.price,
                     updatedAt: item.updatedAt,
                     payment: item.payment ?? null,
                     cancel: item.cancel,
                     status: item.status,
                   
                     combo:  await Bluebird.map(item.combo, async(item)=>{
                         const combo = await Combo.findById(item.id).lean()
                         console.log( "combo",combo)
                         return{
                           id : combo._id,
                           name: combo.name,
                           value: item.value,
                         }
                     }, { concurrency: item.combo.length}) ?? null,
                     maQR:  qr,
                    
                   };
             }, { concurrency: data.length})
 
       // console.log(array1)
       return array1;
     });
     ticket.sort((a,b)=>{
      if (a.updatedAt > b.updatedAt) return 1;
      if (a.updatedAt < b.updatedAt) return -1;
     })  
     return ticket  
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


const ticketController = {
  createTicket: async (req, res) => {
    try {
      const timeNow = new Date()
      const infoTicket = req.body;
      const showtime = await ShowTime.findById(infoTicket.time).lean()
      const timeShow = new Date(showtime.time)
      if(timeNow.getTime() >  timeShow.getTime() + 1800000) return res.status(404).json({ error: error });
      console.log(infoTicket);
      const ISticket = await Ticket.findOne({paymentId: infoTicket.paymentId});
      if(!ISticket){
      const newTicket = new Ticket(infoTicket);
      const ticket = await newTicket.save().then(async(data)=>{
        const user = await User.findById(data.user).lean()
        const link ="Cảm ơn bạn đã mua vé thành CSV, chi tiết vé vui lòng xem trong mục: Vé của bạn"
        console.log(link)
        await sendEmail(user.email, "Mua vé thành công", link);
      })
     
      console.log(ticket);
      res.status(200).json({ticket, success: true});
      }
      else if(ISticket)
      res.status(200).json({success: false})
      
    } catch (error) {
      res.status(404).json({ error: error });
    }
  },
  getAllTicketUserID: async (req, res) => {
    // console.log(req.params.userID);
    try {
      const userID = req.params.userID;
      const tickets = await Ticket.find({ user: userID })
        .lean()
        .then(async (data) => {
                const array1 = await Bluebird.map(data, async(item)=>{
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
                    // console.log(qr);
                    
                    return {
                        tiketID: item._id,
                        showTime: await ShowTime.findById(item.time)
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
                        user: await User.findById(item.user).lean().then((data)=>{
                            return {username: data.username, email: data.email, fullName: data.fullName,phoneNumber: data.phoneNumber}
                          }),
                        number: item.number,
                        price: item.price,
                        payment: item.payment ?? null,
                        cancel: item.cancel,
                        status: item.status,
                      
                        combo:  await Bluebird.map(item.combo, async(item)=>{
                            const combo = await Combo.findById(item.id).lean()
                            console.log( "combo",combo)
                            return{
                              id : combo._id,
                              name: combo.name,
                              value: item.value,
                            }
                        }, { concurrency: item.combo.length}) ?? null,
                        maQR:  qr,
                       
                      };
                }, { concurrency: data.length})

          // console.log(array1)
          return array1;
        });
      res.status(200).json(tickets);
    } catch (error) {
      res.status(404).json({ error: error });
    }
  },
 getTicketID:  async(req,res)=>{
  try {
    const tiketID = req.params.tiketID;
    const data = await ticket(tiketID);
     const ticket = await Bluebird.map((data), async(item)=>{

      return {
         ...item,
         combo:  await Bluebird.map(item.combo, async(item)=>{
          const combo = await Combo.findById(item.id).lean()
          console.log( "combo",combo)
          return{
            id : combo._id,
            name: combo.name,
            value: item.value,
          }
      }, { concurrency: item.combo.length}) ?? null,

      }

     },{ concurrency: data.length})       


    res.status(200).json({ticket: ticket,id : tiketID});
  } catch (error) {
    res.status(404).json({ error: error });
  }
 },

 getAlllTicket:  async(req,res)=>{
  try {
 
    const query = req.params.query
    let tickets =await getAlllTicketQuery(query) 
    res.status(200).json({tickets: tickets});
  } catch (error) {
    res.status(404).json({ error: error });
  }
 },

 

/// xác nhận đặt vé 

accuracyTicket:  async(req,res)=>{
  try {
 
    const _id = req.params.query
    const ticket = await Ticket.findById(_id).lean()
    if(ticket) {
     await Ticket.findByIdAndUpdate(_id,{
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
  try {
 
    const _id = req.params.query
    const ticket = await Ticket.findById(_id).lean()
    if(ticket) {
    await  Ticket.findByIdAndUpdate(_id,{
        $set:{
          cancel: true,
        }
      })
      res.status(200).json({success: true});
    }     
    res.status(404).json({ error: error });
  } catch (error) {
    res.status(404).json({ error: error });
  }
 },

 // Hủy vé 
 deleteTicket:  async(req,res)=>{
  try {
 
    const _id = req.params.query
    const ticket = await Ticket.findById(_id).lean()
    if(ticket) {
     await Ticket.delete(_id).then(async(data)=>{
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
