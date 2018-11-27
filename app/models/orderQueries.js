const queryCreate = {
  text:
    "INSERT INTO orders(origin, destination,  recipientPhone,initiatorId , comments, status) VALUES($1, $2, $3, $4, $5,  'created') RETURNING *",
  values: [],
}; // create and return the value cre

const queryGetAll = {
  text: `select * from orders;
  `,
};

const queryGetAllOrderUser = {
  text: 'select * from orders where initiatorId =$1;',
  values: [],
};

const queryGetId = {
  text: 'select * from orders where id=$1;',
};

const queryGetOneOrderUSer = {
  text: 'select * from orders where id=$1 and initiatorId=$2;',
  values: [],
};

const queryUpdateStatus = {
  text: 'UPDATE ORDERs set status= $1 where id=$2;',
  values: [],
};

const queryUpdateLocation = {
  text: 'UPDATE ORDERs set presentLocation= $1 where id=$2;',
  values: [],
};

const queryUpdateDestination = {
  text: 'UPDATE ORDERs set destination= $1 where id=$2;',
  values: [],
};

const queryUpdateWeight = {
  text: 'UPDATE ORDERs set weight= $1, status =$2, price = $3 where id=$4;',
  values: [],
};

const queryUpdateDeliver = {
  text:
    "UPDATE orders set status= 'delivered' , deliveryDate=now(), presentLocation=$2 where id=$1",
  values: [],
};

const queryCancel = {
  text: "UPDATE ORDERs set status= 'canceled' where id=$1;",
  values: [],
};

export {
  queryCreate,
  queryGetAll,
  queryGetAllOrderUser,
  queryGetId,
  queryGetOneOrderUSer,
  queryUpdateDeliver,
  queryUpdateDestination,
  queryUpdateLocation,
  queryUpdateStatus,
  queryUpdateWeight,
  queryCancel,
};
