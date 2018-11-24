const queryCreate = {
  text:
    "INSERT INTO orders(origin, destination,  recipientPhone,initiatorId , comments, status) VALUES($1, $2, $3, $4, $5,  'created') RETURNING *",
  values: [],
}; // create and return the value cre

const queryGetAll = {
  text: `select * from orders;
  `,
};

const queryGetAllUser = {
  text: 'select * from orders where initiatorId =$1;',
};

const queryGetId = {
  text: 'select * from orders where id=$1;',
};

const queryGetIdUSer = {
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
  text: 'UPDATE ORDERs set destination= $1 where id=$2 and InitiatorId=$3;',
  values: [],
};

const queryUpdateWeight = {
  text: 'UPDATE ORDERs set weight= $1 where id=$2;',
  values: [],
};

const queryUpdateDeliver = {
  text:
    "UPDATE orders set status='delivered' and deliveryDate=now() where id=$1",
  values: [],
};

export {
  queryCreate,
  queryGetAll,
  queryGetAllUser,
  queryGetId,
  queryGetIdUSer,
  queryUpdateDeliver,
  queryUpdateDestination,
  queryUpdateLocation,
  queryUpdateStatus,
  queryUpdateWeight,
};
