class ContenedorMongo {
  constructor(model) {
    this.model = model;
  }

  async getAll() {
    try {
      const response = await this.model.find().lean();

      return response;
    } catch (err) {
      throw new Error("Error getting all resources");
    }
  }

  async getById(id) {
    try {
      const response = await this.model.findById(id);

      return response;
    } catch (err) {
      throw new Error("Error getting by id");
    }
  }

  async save(resource) {
    try {
      const response = await this.model.create(resource);
      return response;
    } catch (err) {
      throw new Error("Error saving resources");
    }
  }

  async update(id, resource) {
    try {
      const response = await this.model.findByIdAndUpdate(id, resource);

      return response;
    } catch (err) {
      throw new Error("Error updating resources");
    }
  }

  async delete(id) {
    try {
      const response = await this.model.findByIdAndDelete(id);

      return response;
    } catch (err) {
      throw new Error("Error deleting resources");
    }
  }
}

export default ContenedorMongo;
