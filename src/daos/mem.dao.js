export default class MemDao {
  constructor(collection) {
    this.collection = [];
  }

  async create(documentToCreate) {
    try {
      const createdDocument = this.collection.push(documentToCreate);

      return createdDocument;
    } catch (err) {
      console.log("Error creating document", err);
    }
  }

  async update(filter, updateData) {
    try {
      newCollection = this.collection.filter((item) => item !== filter);
      newCollection.push(updateData);
    } catch (err) {
      console.log("Error updating document", err);
    }
  }

  async getAll() {
    try {
      const allDocuments = this.collection;

      return allDocuments;
    } catch (err) {
      console.log("Error getting all documents", err);
    }
  }

  async getById(id) {
    try {
      const document = this.collection.filter((item) => item._id === id);

      return document;
    } catch (err) {
      console.log("Error getting document by id", err);
    }
  }

  async getByFilter(filters) {
    try {
      const document = this.collection.filter((item) => item === filters);

      return document;
    } catch (err) {
      console.log("Error getting document by filters", err);
    }
  }

  async delete(id) {
    try {
      const deletedDocument = this.collection.filter((item) => item._id !== id);

      return deletedDocument;
    } catch (err) {
      console.log("Error creating document", err);
    }
  }
}
