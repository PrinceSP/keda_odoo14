{
    'name': 'Material Registration',
    'version': '1.0',
    'category': 'Operations',
    'summary': 'Manage material registrations for selling products.',
    'author': 'Prince Siachin',
    'depends': ['base'],
    'data': [
        'security/security.xml',
        'security/ir.model.access.csv',
        'views/material_registration_views.xml',
    ],
    'installable': True,
    'application': True,
}
