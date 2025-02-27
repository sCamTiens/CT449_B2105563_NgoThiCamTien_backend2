
const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.name) {
    return next(new ApiError(400, "Name can not be empty"));
  }

  try {
    const contactService = new ContactService(MongoDB.client)
    const document = await contactService.create(req.body)
    res.json(document)
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while creating the contact")
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = []

  try {
    const contactService = new ContactService(MongoDB.client)
    const { name } = req.query
    if (name) {
      documents = await contactService.findByName(name)
    } else {
      documents = await contactService.find({})
    }
    res.json(documents)
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while retrieving contacts")
    );
  }
};

exports.findOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      return next(new ApiError(400, "Id can not be empty"));
    }
    const contactService = new ContactService(MongoDB.client)
    const document = await contactService.findById(id)
    if (!document || !document.length) {
      return next(new ApiError(404, "Contact not found"))
    }
    res.json(document)
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving contact with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  const { id } = req.params;
  const payload = req.body;
  
  try {
    if (!id) {
      return next(new ApiError(400, "Id can not be valid"));
    }

    if (Object.keys(payload).length === 0) {
      return next(new ApiError(400, "Data to update can not be empty"));
    }

    const contactService = new ContactService(MongoDB.client)
    const document = await contactService.update(id, payload)

    if (!document) {
      return next(new ApiError(404, "Contact not found"))
    }
    res.json(document)
  } catch (error) {
    return next(
      new ApiError(500, `Error updating contact with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  const { id } = req.params;
  try {
   if (!id) {
     return next(new ApiError(400, "Id can not valid")); 
   }
   const contactService = new ContactService(MongoDB.client)
   const document = await contactService.delete(id)
   if (!document) {
     return next(new ApiError(404, "Contact not found"))
   } 
   res.json(document)
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete contact with id=${req.params.id}`)
    ); 
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client)
    const deletedCount = await contactService.deleteAll()
    return res.send({
      message: `${deletedCount} contacts were deleted successfully`
    })
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while removing all contacts")
    ); 
  }
};

exports.findAllFavorite = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client)
    const documents = await contactService.findFavorite()
    res.json(documents) 
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while retrieving favorite contacts")
    ); 
  }
};