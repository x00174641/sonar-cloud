import unittest
from unittest.mock import patch
from flask import Flask, request
from webapp.api.posts.addDislike import dislikeVideo

class TestDislikeVideo(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.config['TESTING'] = True

    @patch('webapp.api.posts.addDislike.table')
    @patch('webapp.api.posts.addDislike.jwt')
    def test_dislike_video_disliked_already(self, mock_jwt, mock_table):
        mock_jwt.decode.return_value = {'username': 'test_user'}
        mock_table.get_item.return_value = {'Item': {'videoID': '123', 'dislikes': [{'username': 'test_user'}]}}
        with self.app.test_request_context('/api/dislike/', method='POST', json={'videoID': '123'}):
            request.headers = {'Authorization': 'Bearer my_token', 'Content-Type': 'application/json'}
            response_tuple = dislikeVideo()
        self.assertIsInstance(response_tuple, tuple)
        response, status_code = response_tuple
        self.assertIsInstance(response, Flask.response_class)
        json_data = response.get_json()
        self.assertEqual(status_code, 200)
        self.assertEqual(json_data, {'status': 'success', 'message': 'Dislike removed'})

    @patch('webapp.api.posts.addDislike.table')
    @patch('webapp.api.posts.addDislike.jwt')
    def test_dislike_video_not_disliked(self, mock_jwt, mock_table):
        mock_jwt.decode.return_value = {'username': 'test_user'}
        mock_table.get_item.return_value = {'Item': {'videoID': '123'}}
        with self.app.test_request_context('/api/dislike/', method='POST', json={'videoID': '123'}):
            request.headers = {'Authorization': 'Bearer my_token', 'Content-Type': 'application/json'}
            response_tuple = dislikeVideo()
        self.assertIsInstance(response_tuple, tuple)
        response, status_code = response_tuple
        self.assertIsInstance(response, Flask.response_class)
        json_data = response.get_json()
        self.assertEqual(status_code, 200)
        self.assertEqual(json_data, {'status': 'success', 'message': 'Dislike added'})

    @patch('webapp.api.posts.addDislike.table')
    @patch('webapp.api.posts.addDislike.jwt')
    def test_dislike_video_not_found(self, mock_jwt, mock_table):
        mock_jwt.decode.return_value = {'username': 'test_user'}
        mock_table.get_item.return_value = {}
        with self.app.test_request_context('/api/dislike/', method='POST', json={'videoID': '123'}):
            request.headers = {'Authorization': 'Bearer my_token', 'Content-Type': 'application/json'}
            response_tuple = dislikeVideo()
        self.assertIsInstance(response_tuple, tuple)
        response, status_code = response_tuple
        self.assertIsInstance(response, Flask.response_class)
        json_data = response.get_json()
        self.assertEqual(status_code, 404)
        self.assertEqual(json_data, {'status': 'error', 'message': 'Video not found'})