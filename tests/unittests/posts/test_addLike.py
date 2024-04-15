import unittest
from unittest.mock import patch
from flask import Flask, request
from webapp.api.posts.addLike import likeVideo

class TestaddLike(unittest.TestCase):

    def setUp(self):
        self.app = Flask(__name__)
        self.app.config['TESTING'] = True

    @patch('webapp.api.posts.addLike.table')
    @patch('webapp.api.posts.addLike.jwt')
    def test_like_video_liked_already(self, mock_jwt, mock_table):
        mock_jwt.decode.return_value = {'username': 'test_user'}
        mock_table.get_item.return_value = {'Item': {'videoID': '123', 'likes': [{'username': 'test_user'}]}}

        with self.app.test_request_context('/api/like/', method='POST', json={'videoID': '123'}):
            request.headers = {'Authorization': 'Bearer my_token', 'Content-Type': 'application/json'}
            response_tuple = likeVideo()
        
        self.assertIsInstance(response_tuple, tuple)
        response, status_code = response_tuple
        self.assertIsInstance(response, Flask.response_class)
        json_data = response.get_json()
        self.assertEqual(status_code, 200)
        self.assertEqual(json_data, {'status': 'success', 'message': 'Like removed'})

    @patch('webapp.api.posts.addLike.table')
    @patch('webapp.api.posts.addLike.jwt')
    def test_like_video_not_liked(self, mock_jwt, mock_table):
        mock_jwt.decode.return_value = {'username': 'test_user'}
        mock_table.get_item.return_value = {'Item': {'videoID': '123'}}

        with self.app.test_request_context('/api/like/', method='POST', json={'videoID': '123'}):
            request.headers = {'Authorization': 'Bearer my_token', 'Content-Type': 'application/json'}
            response_tuple = likeVideo()

        self.assertIsInstance(response_tuple, tuple)
        response, status_code = response_tuple
        self.assertIsInstance(response, Flask.response_class)
        json_data = response.get_json()
        self.assertEqual(status_code, 200)
        self.assertEqual(json_data, {'status': 'success', 'message': 'Like added'})

    @patch('webapp.api.posts.addLike.table')
    @patch('webapp.api.posts.addLike.jwt')
    def test_like_video_not_found(self, mock_jwt, mock_table):
        mock_jwt.decode.return_value = {'username': 'test_user'}
        mock_table.get_item.return_value = {}

        with self.app.test_request_context('/api/like/', method='POST', json={'videoID': '123'}):
            request.headers = {'Authorization': 'Bearer my_token', 'Content-Type': 'application/json'}
            response_tuple = likeVideo()

        self.assertIsInstance(response_tuple, tuple)
        response, status_code = response_tuple
        self.assertIsInstance(response, Flask.response_class)
        json_data = response.get_json()
        self.assertEqual(status_code, 404)
        self.assertEqual(json_data, {'status': 'error', 'message': 'Video not found'})
