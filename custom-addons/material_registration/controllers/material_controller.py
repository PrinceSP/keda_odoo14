from odoo import http
from odoo.http import request, Response
import json

class MaterialRegistrationController(http.Controller):

    @http.route('/api/materials', type='json', auth='public')
    def get_all_materials(self, **kw):
        materials = request.env['material.registration'].sudo().search([])
        data = [{
            'code': m.code,
            'name': m.name,
            'material_type': m.material_type,
            'buy_price': m.buy_price,
            'supplier': m.supplier_id.name
        } for m in materials]
        return {'data': data}

    @http.route('/api/materials/create', type='json', auth='public')
    def create_material(self, **params):
        record = request.env['material.registration'].sudo().create(params)
        return {'id': record.id, 'message': 'Material created successfully'}

    @http.route('/api/materials/update/<int:id>', type='json', auth='public')
    def update_material(self, id, **params):
        material = request.env['material.registration'].sudo().browse(id)
        if not material.exists():
            return {'error': 'Material not found'}
        material.write(params)
        return {'message': 'Material updated successfully'}

    @http.route('/api/materials/delete/<int:id>', type='json', auth='public')
    def delete_material(self, id):
        material = request.env['material.registration'].sudo().browse(id)
        if not material.exists():
            return {'error': 'Material not found'}
        material.unlink()
        return {'message': 'Material deleted successfully'}
